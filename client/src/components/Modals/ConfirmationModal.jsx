import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white border border-gray-300 shadow-md rounded-md p-6 max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Confirmation</h2>
          <p>Are you sure you want to delete this item?</p>
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
