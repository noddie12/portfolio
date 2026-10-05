# Beyond the Reef — Do Hai Anh's Portfolio

A fully responsive, ocean-inspired one-page personal portfolio website.

---

## 📁 Project Structure

```
portfolio_empty/
├── index.html        ← Main HTML (all sections)
├── styles.css        ← Full stylesheet (colors, layout, animations)
├── script.js         ← Interactions (nav, animations, gallery, audio)
├── images/           ← Add your photos here (see naming below)
│   ├── portrait.jpg         ← Hero portrait (recommended: 3:4 ratio)
│   ├── gallery-1.jpg        ← Speaking
│   ├── gallery-2.jpg        ← Competing
│   ├── gallery-3.jpg        ← Leading
│   ├── gallery-4.jpg        ← Celebrating
│   ├── gallery-5.jpg        ← Learning
│   └── gallery-6.jpg        ← Growing
├── audio/
│   └── ambient.mp3          ← Optional ocean ambient sound (off by default)
└── cv.pdf                   ← Your CV for download
```

---

## 🖼️ Adding Your Photos

1. Place your portrait photo as `images/portrait.jpg`
2. Place gallery images as `images/gallery-1.jpg` through `images/gallery-6.jpg`
3. Use high-quality images (recommended: 800px+ wide, good lighting)

**Portrait tips:**
- Aspect ratio 3:4 (portrait orientation) works best
- Good lighting, professional or semi-professional setting
- The photo will appear in the Hero section

**Gallery tips:**
- Mix action shots (speaking, competing) with moments (awards, teamwork)
- Landscape or square images work best for most gallery slots
- `gallery-1.jpg` and `gallery-6.jpg` appear taller (span 2 rows on desktop)
- `gallery-4.jpg` appears wider (spans 2 columns on desktop)

---

## 🔊 Optional Ambient Audio

1. Find a royalty-free calm ocean/ambient track (e.g. from Freesound, Pixabay, or Epidemic Sound)
2. Convert to MP3 if needed
3. Save as `audio/ambient.mp3`

The audio button is at the **bottom-right corner** of the page.  
Audio is **OFF by default** — visitors must click to turn it on.

---

## 📄 Adding Your CV

Save your CV file as `cv.pdf` in the root folder.  
The "Download CV" button in the Hero section will link to it automatically.

---

## 🎨 Color Palette (reference)

| Name         | Hex       | Usage                              |
|--------------|-----------|------------------------------------|
| Deep Navy    | `#0E2340` | Headings, dark sections            |
| Ocean Blue   | `#1E5F8C` | Accents, icons, links              |
| Seafoam      | `#CFE9F2` | Soft backgrounds, chips            |
| Pearl White  | `#F8FAFC` | Main background                    |
| Coral Accent | `#F28C6F` | Highlights, hover states, numbers  |
| Charcoal     | `#252525` | Body text                          |

---

## ✏️ Customization

- **Update LinkedIn URL**: Find `href="https://linkedin.com"` in `index.html` and replace with your profile link
- **Update CV filename**: Change `href="cv.pdf"` if your file has a different name
- **Gallery captions**: Edit the `data-caption` attributes on `.gallery__item` elements
- **Photo filenames**: You can use any filenames — just update the `src=""` attributes in the gallery section of `index.html`

---

## 🌊 Design Notes

The "Beyond the Reef" concept uses:
- Ocean color palette with navy, seafoam, coral
- Wave SVG dividers between sections
- Floating particle effect in the hero
- Subtle parallax scrolling on the hero
- Smooth fade-up reveal animations on scroll
- Count-up number animations in the metrics section
- Elegant lightbox for the gallery

---

Built with pure HTML, CSS, and vanilla JavaScript — no frameworks required.
