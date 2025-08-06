# React Zen Editor

A modern, feature-rich WYSIWYG editor for React with Korean/English multilingual support.

## Features

🌟 **Rich Text Editing**
- Bold, Italic, Underline formatting
- Text and background color customization
- Font size and line height control
- Text alignment (left, center, right)

📝 **Content Structure**
- Headings (H1, H2, H3)
- Ordered and unordered lists
- Horizontal dividers
- Special character insertion

🎨 **Media Support**
- Image insertion with preview
- YouTube video embedding
- Link insertion with target options
- Drag and drop support

🌍 **Multilingual Support**
- Auto-detection of Korean/English
- Localized UI and tooltips
- RTL text support ready

⚡ **Modern Features**
- Dual mode: WYSIWYG ↔ HTML code editor
- Copy HTML to clipboard
- Undo/Redo functionality
- Responsive design
- TypeScript support

## Installation

```bash
npm install react-zen-editor
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import { ZenEditor } from 'react-zen-editor';

function App() {
  const [content, setContent] = useState('<p>Start typing...</p>');

  return (
    <div>
      <ZenEditor
        value={content}
        onChange={setContent}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML content of the editor |
| `onChange` | `(content: string) => void` | `() => {}` | Callback function called when content changes |

## Styling

The editor comes with built-in styles, but you can customize the appearance by overriding CSS classes:

```css
/* Custom editor container */
.zen-editor-container {
  border: 2px solid #your-color;
  border-radius: 8px;
}

/* Custom toolbar */
.zen-editor-toolbar {
  background-color: #your-background;
}

/* Custom editor content */
.editor-content {
  font-family: 'your-font';
  font-size: 16px;
}
```

## Advanced Usage

### With Custom Styling

```jsx
import React, { useState } from 'react';
import { ZenEditor } from 'react-zen-editor';

function AdvancedEditor() {
  const [content, setContent] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>My Blog Post Editor</h2>
      <ZenEditor
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
          // Auto-save or other logic
          console.log('Content updated:', newContent);
        }}
      />
      
      {/* Preview */}
      <div className="preview">
        <h3>Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
```

### Form Integration

```jsx
import React, { useState } from 'react';
import { ZenEditor } from 'react-zen-editor';

function BlogForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    console.log('Submitting:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            title: e.target.value
          }))}
        />
      </div>
      
      <div>
        <label>Content:</label>
        <ZenEditor
          value={formData.content}
          onChange={(content) => setFormData(prev => ({
            ...prev,
            content
          }))}
        />
      </div>
      
      <button type="submit">Publish</button>
    </form>
  );
}
```

## Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Y` / `Cmd+Y` - Redo
- `Ctrl+B` / `Cmd+B` - Bold
- `Ctrl+I` / `Cmd+I` - Italic
- `Ctrl+U` / `Cmd+U` - Underline

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- React 16.8+ (Hooks support required)
- lucide-react (for icons)

## Development

To contribute to this project:

```bash
# Clone the repository
git clone https://github.com/yourusername/react-zen-editor.git

# Install dependencies
npm install

# Start library development mode (watch mode)
npm run dev

# Build the package
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Testing Environment

This project includes a Next.js test environment for development and testing:

```bash
# Start Next.js test server from project root
./dev.sh

# OR using npm script
npm run test-dev
```

The test environment features:
- **Live Editor Testing**: Test all editor features in a real Next.js environment
- **Real-time Preview**: See changes instantly during development
- **Statistics Monitoring**: Track character count, HTML length, and more
- **Sample Content**: Pre-loaded Korean/English test content
- **Hot Reload**: Automatic page refresh when changes are made

**Test Environment Access**:
- Local: `http://localhost:3000/editor` (or next available port)
- Features: Full editor demo with statistics and HTML preview

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## Changelog

### v1.0.9 (Latest)
- **Enhanced Toolbar Separators**: Added consistent visual separators (|) between all toolbar groups for better organization
- **Mobile-Responsive Separators**: Smart separator hiding on mobile devices for cleaner mobile UI experience
- **Improved Visual Hierarchy**: Better visual grouping of toolbar functions with contextual separator display
- **Cross-Device Consistency**: Optimal separator display on both desktop and mobile devices

### v1.0.8
- **Improved Toolbar Layout**: Repositioned font size control to appear before heading/paragraph styles
- **Enhanced User Experience**: More logical workflow with font size settings grouped with text styling controls
- **Better Organization**: Font size now positioned between color controls and heading/line height controls
- **Consistent Grouping**: Text formatting tools (font size, headings, line height) now properly grouped together

### v1.0.7
- **Desktop Layout Fix**: Restored original desktop toolbar layout to v1.0.5 state
- **Reverted Responsive Changes**: Removed mobile responsive design that caused desktop layout issues
- **Stable Desktop Experience**: Desktop toolbar now works exactly as in v1.0.5 with proper spacing and button sizes
- **Quality Assurance**: Fixed regression issues from v1.0.6 responsive implementation

### v1.0.6 (Deprecated)
- ⚠️ **Deprecated due to desktop layout issues** - Please use v1.0.7 instead
- Mobile Responsive Toolbar (caused desktop regression)
- Smart Tool Prioritization
- Progressive Enhancement
- Compact Mobile Design

### v1.0.5
- **Enhanced UI/UX**: Improved toolbar organization and visual feedback positioning
- **Copy Success Position**: Moved copy success message to appear after the copy button for better user feedback
- **Font Size Icon**: Changed font size dropdown arrow from ▼ to ↕ for better visual representation
- **Toolbar Optimization**: Repositioned font size control before color controls for more logical workflow

### v1.0.4
- **Enhanced Copy Functionality**: Smart copy behavior - HTML code in HTML view, formatted content in editor view
- **Improved Layout**: Reorganized bottom toolbar (copy/HTML view buttons on left, character count on right)
- **Better Development Experience**: Added Next.js test environment with comprehensive testing tools
- **Code Quality**: Removed legacy files and improved project structure

### v1.0.0
- Initial release
- WYSIWYG editor with full formatting support
- Korean/English multilingual support
- Media insertion capabilities
- HTML code editor mode
- TypeScript support

## Support

If you encounter any issues or have questions, please:

1. Check the [FAQ](#faq)
2. Search existing [issues](https://github.com/yourusername/react-zen-editor/issues)
3. Create a new issue with detailed information

## FAQ

**Q: How do I customize the toolbar?**
A: Currently, the toolbar is not customizable, but this feature is planned for future releases.

**Q: Can I use this editor in a Next.js project?**
A: Yes! The editor supports Next.js. Make sure to use it in client-side components with the `'use client'` directive.

**Q: How do I handle image uploads?**
A: The editor accepts image URLs. For file uploads, you'll need to implement your own upload handler and pass the resulting URL to the editor.

**Q: Is server-side rendering supported?**
A: The editor is designed for client-side use. For SSR frameworks like Next.js, use dynamic imports or ensure the component only renders on the client side.