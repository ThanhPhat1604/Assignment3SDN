"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const carouselImages: CarouselImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center",
    alt: "Fashion Collection",
    title: "New Arrivals",
    description: "Discover the latest fashion trends"
  },
  {
    id: "2", 
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&crop=center",
    alt: "Elegant Dresses",
    title: "Elegant Style",
    description: "Sophisticated fashion for every occasion"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=800&fit=crop&crop=center",
    alt: "Casual Wear",
    title: "Casual Comfort",
    description: "Relaxed and stylish everyday wear"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop&crop=center",
    alt: "Street Fashion",
    title: "Street Style",
    description: "Urban fashion that makes a statement"
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop&crop=center",
    alt: "Fashion Model",
    title: "Trendy Collection",
    description: "Stay ahead with the latest styles"
  }
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out bg-gradient-to-br from-gray-100 to-gray-200 ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center center' }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 group z-20"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 group z-20"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ 
            width: isAutoPlay ? '100%' : '0%',
            animation: isAutoPlay ? 'progress 4s linear infinite' : 'none'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
