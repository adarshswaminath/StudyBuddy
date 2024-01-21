import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTE } from "../graphql/queries";
import { UPDATE_NOTE } from "../graphql/mutations";
import useLocation from "wouter/use-location";

const EditNote = () => {
  // const [location, setLocation, navigate] = useLocation();
  const [location, navigate] = useLocation();
  const noteId = String(location.split("/").slice(2));

  const { loading, error, data } = useQuery(GET_NOTE, {
    variables: { noteId },
  });

  const [updateNote] = useMutation(UPDATE_NOTE);

  const [noteDetails, setNoteDetails] = useState({
    title: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (!loading && !error && data && data.getNote.success) {
      const fetchedNote = data.getNote.note;
      setNoteDetails({
        title: fetchedNote.title,
        content: fetchedNote.content,
        date: fetchedNote.date,
      });
    }
  }, [loading, error, data]);

  const handleInputChange = (e) => {
    setNoteDetails({
      ...noteDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateNote = async (e) => {
    try {
      e.preventDefault();
      const { data } = await updateNote({
        variables: {
          noteId,
          input: {
            title: noteDetails.title,
            content: noteDetails.content,
          },
        },
      });

      if (data && data.updateNote.success) {
        console.log("Note updated successfully!");
        // redirect the user to the notes page
        navigate("/notes");
      } else {
        console.error(`Error updating note: ${data.updateNote.message}`);
      }
    } catch (error) {
      console.error("Error updating note:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !data.getNote.success) {
    return (
      <p>Error fetching note: {error ? error.message : data.getNote.message}</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">Edit Note</h2>
      <form onSubmit={handleUpdateNote}>
        <div className="mb-4">
          <label className="block text-gray-600">Title:</label>
          <input
            type="text"
            name="title"
            value={noteDetails.title}
            onChange={handleInputChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Content:</label>
          <textarea
            name="content"
            value={noteDetails.content}
            onChange={handleInputChange}
            className="border rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Update Note
        </button>
      </form>
    </div>
  );
};

export default EditNote;
