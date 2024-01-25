"use client";

import Image from "next/image";
import { useState } from "react";
import { UploadData } from "@/types";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/image-placeholder";

interface ImageSliderProps {
  images: UploadData[];
}

export default function ImageSelector({ images }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="w-full h-fit">
      <div
        className="relative rounded h-[500px] w-full overflow-hidden"
        id="bigger-preview"
      >
        {!!images.length ? (
          <Image
            src={images[currentImageIndex].url}
            fill
            alt="Product Image"
            className="w-full h-full object-cover rounded transition duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      {!!images.length && (
        <div className="w-full grid grid-cols-6 gap-2 my-4 h-max">
          {images.map((image, index) => (
            <div key={image.name} className="relative rounded h-24 w-24">
              <Button
                className="rounded"
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.url}
                  fill
                  alt="Product Image"
                  className="w-full h-full object-cover rounded"
                />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
