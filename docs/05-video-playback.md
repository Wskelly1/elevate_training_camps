# Video playback

How video works in this app, and the one bug that will silently break it.

## The trap: HLS branch ordering

**Always test `Hls.isSupported()` before `video.canPlayType()`.** Never the
other way round.

```ts
const mod = await import('hls.js');
const Hls = mod.default;

if (Hls.isSupported()) {
  hls = new Hls({ capLevelToPlayerSize: true });
  hls.loadSource(src);
  hls.attachMedia(video);
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = src;   // Safari / iOS: native HLS, no MSE needed
}
```

The intuitive order — native first, hls.js as fallback — is wrong, and it fails
in a way that gives you nothing to search for. Measured on Chrome 151:

```
canPlayType('application/vnd.apple.mpegurl') → "maybe"
canPlayType('application/vnd.apple.mpegURL') → "maybe"
canPlayType('application/x-mpegURL')         → "maybe"
```

Chrome claims it can *maybe* play HLS, so a native-first check takes that
branch, assigns the `.m3u8` directly, and the load fails with
`MEDIA_ERR_SRC_NOT_SUPPORTED` (error code 4). The element sits at
`readyState 0`, permanently paused, with **nothing logged to the console**. It
works fine in Safari, which is what makes it easy to ship.

This is why the check is ordered the way it is in `HeroVideo.tsx`. The former
`SanityVideo.tsx` had it backwards; the bug was masked because that component
only rendered its mp4 `<source>` fallbacks when `hlsSrc` was absent.

## `HeroVideo.tsx`

The only video component in the app. A full-bleed ambient background player,
modelled on the Under Canvas homepage treatment:

- autoplays, muted, looping, `object-cover`
- **no native controls** — raw browser controls over a hero read as an
  unstyled file dropped into the page
- **never touches document scroll.** The homepage previously set
  `overflow: hidden` on `<body>` at load and then jumped scroll position from
  0 to ~900px. Do not reintroduce that.
- honours `prefers-reduced-motion` by not autoplaying
- exposes a pause/play toggle — WCAG 2.2.2 requires a mechanism to stop motion
  lasting more than five seconds

Props: `playbackId` (Mux), optional `poster`, optional `className`.

## Where the video comes from

Mux, via `sanity-plugin-mux-input`. The homepage reads
`expandMuxVideo.asset.playbackId` from the `homePage` document and builds
`https://stream.mux.com/{playbackId}.m3u8`. If Sanity is unreachable or the
field is empty, the page falls back to a still image rather than failing.

Upload through Sanity Studio → Home Page → the Mux video field. Mux handles
transcoding and adaptive bitrate; nothing is committed to the repo.

## If you need a real *player*

`HeroVideo` is deliberately not one — no controls, no scrubber, no captions.
A media page or testimonial clip needs a separate component. Build it fresh
rather than resurrecting `SanityVideo.tsx` from git history: it carried the
HLS ordering bug above, plus a play-button overlay and loading spinner that
were wrong for a background and only half-right for a player.

Whatever you build needs: the branch ordering above, a `<track>` for captions,
keyboard-accessible controls, and no autoplay with sound.

## Known content limitation

The current hero clip is **~4 seconds, shot 1080×1920 portrait**. It crops hard
to fill a landscape hero and loops too fast to read as cinematic. A hero wants
15–30 seconds of landscape footage — the Under Canvas reference uses 35. This
is a footage problem, not a code problem.
