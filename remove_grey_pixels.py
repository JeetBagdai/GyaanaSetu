from PIL import Image
import sys

def remove_grey_pixels(input_path, output_path, grey_tolerance=20, brightness_threshold=255):
    """
    Removes grey/black pixels from an image. A pixel is considered grey if the difference
    between its highest and lowest RGB values is less than grey_tolerance.
    
    Args:
        input_path: Path to the input image.
        output_path: Path to save the output image (should be .png for transparency).
        grey_tolerance: Maximum difference between max and min RGB values to be considered grey.
        brightness_threshold: Upper limit for brightness. Only greys darker than this are removed.
    """
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            r, g, b, a = item
            
            # Calculate the difference between max and min RGB values
            max_val = max(r, g, b)
            min_val = min(r, g, b)
            
            if (max_val - min_val) <= grey_tolerance and max_val <= brightness_threshold:
                # It's a grey pixel, make it transparent
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Successfully processed image. Saved to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_grey_pixels.py <input_image_path> <output_image_path> [grey_tolerance] [brightness_threshold]")
        sys.exit(1)
        
    input_image = sys.argv[1]
    output_image = sys.argv[2]
    
    tol = 20
    if len(sys.argv) > 3:
        tol = int(sys.argv[3])
        
    bright = 255
    if len(sys.argv) > 4:
        bright = int(sys.argv[4])
        
    remove_grey_pixels(input_image, output_image, tol, bright)
