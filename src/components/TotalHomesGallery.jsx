import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { totalhomesGallery, galleryCategories } from '../data/totalhomes-gallery'

export default function TotalHomesGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredImages = selectedCategory === 'all' 
    ? totalhomesGallery 
    : totalhomesGallery.filter(img => img.category === selectedCategory)

  const openModal = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  if (totalhomesGallery.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Gallery coming soon! Photos will be added here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {galleryCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openModal(image, index)}
          >
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                <p className="text-sm">{image.year}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
              <p className="text-sm opacity-90">{selectedImage.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
