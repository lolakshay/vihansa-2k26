import os
from PIL import Image

# ===== CONFIG =====
input_folder = "img"   # Your website images folder
quality = 85              # 80-85 best for websites
# ===================

valid_extensions = (".jpg", ".jpeg", ".png")

converted = 0
deleted = 0

for root, dirs, files in os.walk(input_folder):
    for file in files:
        if file.lower().endswith(valid_extensions):

            input_path = os.path.join(root, file)
            output_path = os.path.splitext(input_path)[0] + ".webp"

            try:
                img = Image.open(input_path)

                # Convert properly
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                # Save as WebP
                img.save(output_path, "WEBP", quality=quality, method=6)

                # Delete original
                os.remove(input_path)

                converted += 1
                deleted += 1

                print(f"✅ Converted: {input_path}")

            except Exception as e:
                print(f"❌ Error: {input_path} → {e}")

print("\n🎉 Conversion Complete!")
print(f"Total Converted: {converted}")
print(f"Total Deleted: {deleted}")
