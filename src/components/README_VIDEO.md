# SanityVideo Component

A robust, cross-browser compatible video player component for Sanity CMS videos.

## Features

- **Cross-browser compatibility** - Works in Chrome, Firefox, Safari, Edge, and mobile browsers
- **Responsive design** - Maintains aspect ratio on all screen sizes
- **Multiple format support** - Handles MP4 and WebM formats
- **Accessibility features** - Includes captions support and ARIA attributes
- **Error handling** - Gracefully handles loading errors with fallback display
- **Optimized loading** - Uses lazy loading and preload strategies
- **Browser-compliant autoplay** - Respects browser autoplay policies with fallback options
- **Custom play button** - Beautiful overlay play button with hover effects
- **Loading indicators** - Clear visual feedback during video loading
- **Event callbacks** - Hooks for play, pause, ended, error, and loaded events

## Installation

The SanityVideo component is already included in your project. No additional installation is needed.

## Usage

```tsx
import SanityVideo from './SanityVideo';

// Basic usage
<SanityVideo
  videoSrc={data.videoAsset}
  posterSrc={data.posterImage}
  title="Video Title"
/>

// Advanced usage with all options
<SanityVideo
  videoSrc={data.videoAsset}
  posterSrc={data.posterImage}
  fallbackImage={data.fallbackImage}
  title="Detailed Video Title"
  description="This video shows our training camp activities"
  autoPlay={false}
  muted={true}
  loop={true}
  controls={true}
  lazy={true}
  objectFit="cover"
  className="rounded-xl shadow-lg"
  captionSrc="/path/to/captions.vtt"
  onPlay={() => console.log('Video started playing')}
  onPause={() => console.log('Video paused')}
  onEnded={() => console.log('Video ended')}
  onError={(e) => console.error('Video error:', e)}
  onLoadedData={() => console.log('Video data loaded')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoSrc` | `Object` | `undefined` | Sanity file reference for the video (optional when `hlsSrc` is provided) |
| `lowQualitySrc` | `Object` | `undefined` | Lower-resolution Sanity file reference, switched to automatically on repeated stalls |
| `hlsSrc` | `string` | `undefined` | HLS stream URL (e.g. a Mux `stream.mux.com/....m3u8` playback URL); takes precedence over MP4 sources |
| `posterSrc` | `Object` | `undefined` | Sanity image reference for the poster |
| `fallbackImage` | `Object` | `undefined` | Sanity image reference for fallback if video fails |
| `title` | `string` | `''` | Title for the video (used for accessibility) |
| `description` | `string` | `''` | Description for the video (used for accessibility) |
| `autoPlay` | `boolean` | `false` | Whether to attempt to autoplay the video |
| `muted` | `boolean` | `true` | Whether the video should be muted |
| `loop` | `boolean` | `false` | Whether the video should loop |
| `controls` | `boolean` | `true` | Whether to show video controls |
| `lazy` | `boolean` | `true` | Whether to use lazy loading |
| `objectFit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | How the video should fit its container |
| `className` | `string` | `''` | Additional CSS classes |
| `captionSrc` | `string` | `undefined` | URL to WebVTT captions file |
| `fillContainer` | `boolean` | `false` | Fill the parent container absolutely instead of using the aspect-ratio wrapper |
| `pauseWhenOutOfView` | `boolean` | `false` | Pause playback when the video scrolls out of view or the page is hidden |
| `onPlay` | `() => void` | `undefined` | Callback when video starts playing |
| `onPause` | `() => void` | `undefined` | Callback when video is paused |
| `onEnded` | `() => void` | `undefined` | Callback when video playback ends |
| `onError` | `(error: any) => void` | `undefined` | Callback when video encounters an error |
| `onLoadedData` | `() => void` | `undefined` | Callback when video data is loaded |

## Custom Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by:

1. Passing additional classes via the `className` prop
2. Using the default 16:9 aspect ratio or overriding it with custom CSS
3. Styling the play button and loading spinner with your own CSS

## Browser Compatibility Notes

- **Autoplay**: Most browsers block autoplay with sound. The component handles this by:
  - Detecting autoplay support
  - Falling back to muted autoplay when necessary
  - Showing a play button when autoplay is blocked

- **iOS Safari**: iOS Safari has specific video playback restrictions:
  - Videos won't autoplay unless muted and with `playsinline` attribute
  - The component handles this automatically

- **Mobile Data Saving**: Some mobile browsers may block video preloading:
  - The component uses `preload="metadata"` initially
  - Switches to `preload="auto"` after metadata is loaded

## Accessibility

The component includes several accessibility features:

- ARIA attributes for screen readers
- Keyboard navigation for the play button
- Support for captions via the `<track>` element
- Visually hidden title and description

## Error Handling

When a video fails to load or play, the component:

1. Shows a user-friendly error message
2. Displays the fallback image if provided
3. Triggers the `onError` callback if provided
4. Logs detailed error information to the console

## Performance Optimization

- Uses lazy loading to defer loading until needed
- Implements proper cleanup of event listeners
- Optimizes memory usage by pausing video when component unmounts
- Supports both MP4 and WebM formats for better compression

## Example Integration

`SanityVideo` currently has no callers. Its former consumer,
`IntegratedHomepage.tsx`, was the homepage scroll-expansion hero and was
deleted when the homepage was rebuilt — it disabled page scrolling on load.
The homepage now uses `HeroVideo.tsx`, a much smaller ambient background
player with no controls and no scroll interception.

Keep `SanityVideo` for a real *player* (a media page, a testimonial clip),
where controls and an mp4 fallback are wanted — but **audit its HLS branch
before reusing it.** It tests `video.canPlayType('application/vnd.apple.
mpegURL')` before `Hls.isSupported()`. Chrome answers `"maybe"` to that MIME
type and then fails the load with `MEDIA_ERR_SRC_NOT_SUPPORTED`, so passing
`hlsSrc` breaks playback on every non-Safari browser. The mp4 `<source>`
children mask it, but they are only rendered when `hlsSrc` is absent. The
correct order is `Hls.isSupported()` first, native HLS as the fallback — see
`HeroVideo.tsx`.

## Troubleshooting

**Video doesn't play automatically**:
- This is expected behavior in most browsers
- Autoplay with sound is blocked by default
- Use `muted={true}` for autoplay to work

**Video controls not showing**:
- Make sure `controls={true}` is set
- Controls only appear after the video is loaded

**Video quality issues**:
- Check the source video quality in Sanity
- Consider using different resolution versions for different devices

**CORS errors**:
- Sanity's CDN should handle CORS properly
- If issues persist, check your Sanity CORS settings
