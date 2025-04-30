import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addGroup, updateGroup } from "../features/group/groupSlice";

const GroupModal = ({ isOpen, onClose, group = null }) => {
  const dispatch = useDispatch();
  const isEditMode = !!group;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      groupName: group?.name || ""
    }
  });

  useEffect(() => {
    if (isOpen && group) {
      // Reset form with group data when editing
      reset({ groupName: group.name });
    } else if (isOpen && !group) {
      // Reset form when adding new group
      reset({ groupName: "" });
    }
  }, [isOpen, group, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(updateGroup({ id: group.id, name: data.groupName })).unwrap();
      } else {
        await dispatch(addGroup({ name: data.groupName })).unwrap();
      }
      reset();
      onClose();
    } catch (error) {
      setError("groupName", {
        type: "manual",
        message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} group`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? 'Edit Group' : 'Add New Group'}
          </h3>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              {...register("groupName", {
                required: "Group name is required",
              })}
              className={`w-full px-3 py-2 border ${
                errors.groupName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter group name"
            />
            {errors.groupName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.groupName.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : (isEditMode ? 'Update Group' : 'Save Group')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
