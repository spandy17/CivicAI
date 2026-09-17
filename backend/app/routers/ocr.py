import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile
)
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import User
from ..services.ocr_service import (
    extract_text_from_image
)


router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/extract")
async def extract_ocr(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, PNG and WEBP "
                "images are supported."
            )
        )


    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()


    filename = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )


    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )


    try:

        contents = await file.read()


        if len(contents) > 10 * 1024 * 1024:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Image size must be "
                    "below 10 MB."
                )
            )


        with open(
            file_path,
            "wb"
        ) as image_file:

            image_file.write(
                contents
            )


        text = extract_text_from_image(
            file_path
        )


        if not text:

            text = (
                "No readable text was "
                "detected in the image."
            )


        return {
            "success": True,
            "filename": file.filename,
            "text": text
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "OCR error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process image."
            )
        )


    finally:

        if os.path.exists(file_path):

            os.remove(
                file_path
            )