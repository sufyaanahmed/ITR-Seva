from PIL import Image
import os

def remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            avg = (r + g + b) / 3.0
            if avg > 235:
                # 255 -> alpha 0
                # 235 -> alpha 255
                alpha = int(max(0, min(255, 255 - (avg - 235) * (255 / 20.0))))
                pixels[x, y] = (r, g, b, alpha)
                
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

remove_bg(r"C:\Users\USER\.gemini\antigravity-ide\brain\54c556a5-77fd-4cd9-8ac9-705dbe493580\.user_uploaded\media_1787917099963.jpg", r"public\left_curtain.png")
remove_bg(r"C:\Users\USER\.gemini\antigravity-ide\brain\54c556a5-77fd-4cd9-8ac9-705dbe493580\.user_uploaded\media_1787917107864.jpg", r"public\right_curtain.png")
