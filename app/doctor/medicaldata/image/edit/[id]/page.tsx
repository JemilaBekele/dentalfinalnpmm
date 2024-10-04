"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";

type UpdateImageProps = {
    imageId: string; // ID of the image to be updated
};

const UpdateImage: React.FC<UpdateImageProps> = ({ imageId }) => {
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
            setError(null); // Clear any previous error
        } else {
            setImage(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image) {
            setError("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(`/api/patient/image/detail/${imageId}`, {
                method: "PATCH",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Image updated successfully.");
                // Optionally, redirect or refresh the page
                router.reload(); // Reload the page to fetch updated data
            } else {
                setError(data.error || "An error occurred while updating the image.");
            }
        } catch (err) {
            console.error("Error updating image:", err);
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Update Image</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="image">
                        Select New Image:
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Update Image
                </button>
            </form>
        </div>
    );
};

export default UpdateImage;
