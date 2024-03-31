"use client"

import { DialogDemo } from "@/componenet/dial";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";



export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);


  const sending=async()=>{
    console.log(selectedRows)
    try {
      const response = await fetch('http://localhost:4000/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRows }),
      });

      if (response.ok) {
        alert('Email sent successfully');
      } else {
        alert('Failed to send email');
      }
    }
     catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  }

  const toggleRowSelection = (id) => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } 
    else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/list');
        if (!response.ok) {
          alert('Failed to Fetch Data')
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        console.log(data.users)
        setUsers(data.users);
      } 
      catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full min-h-screen">
       <div className="w-full  h-12 flex justify-between items-center  border px-4">
        <div>RED</div>
         <div className="flex gap-2">
         <Button onClick={sending}>Send</Button>
         <DialogDemo/>
         </div>
       </div>
       <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Hobbies</th>
            <th className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
       <tr key={user._id}>
       <td className="px-4 py-2">
       <input
        type="checkbox"
        checked={selectedRows.includes(user._id)}
        onChange={() => toggleRowSelection(user._id)}
        />
      </td>
     <td className="border px-4 py-2">{index + 1}</td>
     <td className="border px-4 py-2">{user.name}</td>
     <td className="border px-4 py-2">{user.phone}</td>
     <td className="border px-4 py-2">{user.email}</td>
     <td className="border px-4 py-2">{user.hobby}</td>
     <td className="border px-4 py-2">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">Delete</button>
    </td>
   </tr>
   ))}
      </tbody>
      </table>
      </div>
    </div>
  );
}
