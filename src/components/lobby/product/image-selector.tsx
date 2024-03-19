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
    <div className="h-fit w-full">
      <div
        className="relative h-[500px] w-full overflow-hidden rounded border"
        id="bigger-preview"
      >
        {!!images.length ? (
          <Image
            src={images[currentImageIndex].url}
            fill
            alt="Product Image"
            className="h-full w-full rounded object-cover transition duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      {!!images.length && (
        <div className="my-4 grid h-max w-full grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div key={image.name} className="relative h-24 rounded border">
              <Button
                className="rounded"
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.url}
                  fill
                  alt="Product Image"
                  className="h-full w-full rounded object-cover"
                />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
