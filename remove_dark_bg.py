from PIL import Image
import sys

def remove_dark_background(input_path, output_path, brightness_threshold=60):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # If the brightest color channel is below the threshold, it's part of the dark noise
            if max(item[0], item[1], item[2]) <= brightness_threshold:
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
        print("Usage: python script.py <input> <output> [threshold]")
        sys.exit(1)
        
    in_p = sys.argv[1]
    out_p = sys.argv[2]
    t = 60
    if len(sys.argv) > 3:
        t = int(sys.argv[3])
    
    remove_dark_background(in_p, out_p, t)
