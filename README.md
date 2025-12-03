# ekusiadadus.github.io

Personal portfolio website for Daisuke Kuriyama.

## 🚀 Deployment Steps

### Step 1: Create Repository
1. Go to [GitHub New Repository](https://github.com/new)
2. Name it exactly: `ekusiadadus.github.io`
3. Set to **Public**
4. Click "Create repository"

### Step 2: Upload Files
1. Click "uploading an existing file" on the new repository page
2. Drag and drop all files from this folder
3. Commit directly to `main` branch

### Step 3: Enable GitHub Pages
1. Go to repository **Settings** > **Pages**
2. Under "Source", select `main` branch
3. Click **Save**
4. Wait 1-2 minutes for deployment

### Step 4: Access Your Site
Visit: https://ekusiadadus.github.io

## 📁 File Structure

```
ekusiadadus.github.io/
├── index.html              # Main page
├── assets/
│   ├── css/
│   │   └── style.css       # Styling
│   ├── js/
│   │   └── main.js         # Interactions
│   └── images/             # Profile image (add your own)
├── files/
│   └── Daisuke_Kuriyama_Resume.pdf  # Your resume
└── README.md               # This file
```

## ✏️ Customization

### Adding Your Photo
1. Add your photo to `assets/images/profile.jpg`
2. In `index.html`, replace the avatar placeholder with:
```html
<img src="assets/images/profile.jpg" alt="Daisuke Kuriyama" class="avatar-img">
```
3. Add CSS in `style.css`:
```css
.avatar-img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
}
```

### Updating Content
- Edit `index.html` to change text content
- Modify `assets/css/style.css` to change colors/styling
- Replace PDF in `files/` directory with updated resume

### Color Customization
Edit CSS variables in `style.css`:
```css
:root {
    --color-accent: #3b82f6;        /* Main accent color */
    --color-gradient-start: #3b82f6; /* Gradient start */
    --color-gradient-end: #8b5cf6;   /* Gradient end */
}
```

## 🔗 Links

- **Live Site**: https://ekusiadadus.github.io
- **GitHub**: https://github.com/ekusiadadus
- **LinkedIn**: https://linkedin.com/in/ekusiadadus
- **Twitter/X**: https://x.com/ekusiadadus

## 📄 License

MIT License - Feel free to use this template for your own portfolio!
