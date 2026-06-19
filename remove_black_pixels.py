from PIL import Image
import sys

def remove_black_pixels(input_path, output_path, tolerance=0):
    """
    Removes black pixels from an image by making them transparent.
    
    Args:
        input_path: Path to the input image.
        output_path: Path to save the output image (should be .png for transparency).
        tolerance: Tolerance for what is considered 'black' (0-255). 0 means strict black (0,0,0).
    """
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            if item[0] <= tolerance and item[1] <= tolerance and item[2] <= tolerance:
                # Change all black (or close to black) pixels to fully transparent
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
        print("Usage: python remove_black_pixels.py <input_image_path> <output_image_path> [tolerance]")
        sys.exit(1)
        
    input_image = sys.argv[1]
    output_image = sys.argv[2]
    
    tol = 0
    if len(sys.argv) > 3:
        tol = int(sys.argv[3])
        
    remove_black_pixels(input_image, output_image, tol)
