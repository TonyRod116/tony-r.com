# TotalHomes Gallery Photos

## How to add photos:

1. **Add your photos to this folder** (`src/assets/totalhomes/`)
   - Use descriptive filenames like: `kitchen-renovation-1.jpg`, `bathroom-remodel-2.jpg`
   - Recommended formats: JPG, PNG, WebP
   - Recommended size: 800x600px or similar aspect ratio

2. **Update the gallery data** in `src/data/totalhomes-gallery.js`:
   ```javascript
   export const totalhomesGallery = [
     {
       id: 'project-1',
       title: 'Modern Kitchen Renovation',
       description: 'Complete kitchen transformation with custom cabinets and marble countertops',
       image: '/src/assets/totalhomes/kitchen-1.jpg', // Your photo filename
       category: 'renovation', // or 'construction', 'design'
       year: '2023'
     },
     // Add more projects...
   ]
   ```

3. **Categories available:**
   - `renovation` - Kitchen, bathroom, room renovations
   - `construction` - New construction projects
   - `design` - Interior design work

## Example structure:
```
src/assets/totalhomes/
├── kitchen-1.jpg
├── kitchen-2.jpg
├── bathroom-1.jpg
├── living-room-1.jpg
└── exterior-1.jpg
```

The gallery will automatically display your photos with filtering and modal viewing capabilities.
