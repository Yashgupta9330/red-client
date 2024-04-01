"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "react-toastify"


export function DialogDemo({setUsers}) {

 const [name,setName]=useState('');
 const [phone,setPhone]=useState('');
 const [email,setEmail]=useState('');
 const [hobby,setHobby]=useState('');
 
 const handlesubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("https://red-s.onrender.com/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, hobby }),
    });

    if (!response.ok) {
      const errorMessage = await response.text().message;
      toast.error(`${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
      });  
      throw new Error("Failed to add user");
    }

    const data = await response.json();
    console.log(data);
    toast.success('Data saved successfully', {
      position: "top-center",
      autoClose: 5000,
    });  
    setName("");
    setPhone("");
    setEmail("");
    setHobby("");
    const updatedResponse = await fetch("https://red-s.onrender.com/list");
    if (!updatedResponse.ok) {
      throw new Error("Failed to fetch updated user list");
    }
    const updatedData = await updatedResponse.json();
    setUsers(updatedData.users);
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to save data", {
      position: "top-center",
      autoClose: 5000,
    });  
  }
};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Data</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ADD Data</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlesubmit}> 
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e)=>setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Phone No
            </Label>
            <Input
              id="username"
              onChange={(e)=>setPhone(e.target.value)}
              className="col-span-3"
              value={phone}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              id="username"
              onChange={(e)=>setEmail(e.target.value)}
              className="col-span-3"
              value={email}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Hobbies
            </Label>
            <Input
              id="username"
              onChange={(e)=>setHobby(e.target.value)}
              className="col-span-3"
              value={hobby}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"> Save changes </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
