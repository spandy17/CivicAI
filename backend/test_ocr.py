from app.services.ocr_service import extract_text_from_image


image_path = input(
    "Enter the full image path: "
).strip().strip('"')


text = extract_text_from_image(
    image_path
)


print("\n----- OCR RESULT -----\n")
print(text)
print("\n----------------------\n")