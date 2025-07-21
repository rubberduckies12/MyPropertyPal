import React from "react";

export default function DeleteConfirmModal({ show, onClose, onDelete }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-700">Delete Rent Payment</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this rent payment? This action cannot be undone.
        </p>
        <div className="flex gap-4 mt-6">
          <button
            className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}