"use client"

import { Button } from "@/components/ui/button"
import { DialogDemo } from "@/componenet/dial"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function Home() {
  const [users, setUsers] = useState([])
  const [selectedEmails, setSelectedEmails] = useState([])
  const [updatedUsers, setUpdatedUsers] = useState([])
  const [email, setEmail] = useState("")
  const [hobby, setHobby] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [editingUserId, setEditingUserId] = useState(null)
  const [sends, setSends] = useState(false)

  const sending = async () => {
    console.log(selectedEmails)
    setSends(true)
    try {
      const response = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedEmails }),
      })
      if (response.ok) {
        setSends(false)
        toast.success('Email Sent Successfully', {
          position: "top-center",
          autoClose: 5000,
        });
     
      } else {
        setSends(false)
        toast.error('Fails to send email', {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } 
    catch (error) {
      setSends(false)
      console.error("Error sending email:", error)
       toast.error('Fails to send email', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }

  const toggleRowSelection = (email) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((selectedEmail) => selectedEmail !== email))
    } else {
      setSelectedEmails([...selectedEmails, email])
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/delete/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id))
        toast.success('User deleted Successfully', {
          position: "top-center",
          autoClose: 5000,
        });
      }
       else {
        toast.error('falied to delete user', {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
     catch (error) {
      console.error("Error deleting user:", error)
      toast.error('Error deleting user', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }

  const handleUpdate = (id, user) => {
    setEditingUserId(id)
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone)
    setHobby(user.hobby)
  }

  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, hobby, phone }),
      })

      if (response.ok) {
        setUpdatedUsers(updatedUsers.filter((userId) => userId !== id))
        toast.success('User updated Successfully', {
          position: "top-center",
          autoClose: 5000,
        });
        // Fetch updated user list
        const updatedResponse = await fetch("http://localhost:4000/list")
        if (!updatedResponse.ok) {
          throw new Error("Failed to fetch updated user list")
        }
        const updatedData = await updatedResponse.json()
        setUsers(updatedData.users)
        setEditingUserId(null)
      } else {
        toast.error('Failed to update user', {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error('Failed to update user', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/list")
        if (!response.ok) {
          toast.error('Failed to fetch list', {
            position: "top-center",
            autoClose: 5000,
          });  
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        console.log(data.users)
        setUsers(data.users)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="w-full min-h-screen">
      <div className="w-full  h-12 flex justify-between items-center  border px-4">
        <div className="text-red-600 text-2xl font-semibold leading-6">RED POSITIVE</div>
        <div className="flex gap-2">
          <Button onClick={sending}>{sends == true ? "Sending" : "Send"}</Button>
          <DialogDemo setUsers={setUsers} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-2 py-2">
                <input type="checkbox" />
              </th>
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Phone Number</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Hobbies</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(user.email)}
                    onChange={() => toggleRowSelection(user.email)}
                  />
                </td>
                <td className="border px-2 py-2">{index + 1}</td>
                <td className="border px-2 py-2 overflow-auto">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-full"
                    />
                  ) : (
                    user.phone
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={hobby}
                      onChange={(e) => setHobby(e.target.value)}
                      className="w-full h-full"
                    />
                  ) : (
                    user.hobby
                  )}
                </td>
                <td className=" flex gap-2 border px-2 py-2">
                  {editingUserId === user._id ? (
                    <Button onClick={() => handleSave(user._id)}>Save</Button>
                  ) : (
                    <>
                      <Button onClick={() => handleUpdate(user._id, user)}>Edit</Button>
                      <Button onClick={() => handleDelete(user._id)}>Delete</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
