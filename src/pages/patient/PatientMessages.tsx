import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, Phone, Video, MoreVertical,CircleX } from "lucide-react";


const PatientMessages = () => {
   // Dummy data for message threads
   const messageThreads = [
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg1",
        unread: 1,
        active: true,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg2",
        unread: 0,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg3",
        unread: 0,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg4",
        unread: 0,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg5",
        unread: 1,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg6",
        unread: 0,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg7",
        unread: 0,
        active: false,
    },
    {
        name: "Dr. Abhinand Choudry",
        specialty: "Endocrinologist",
        hospital: "City Hospital",
        avatar: "https://i.pravatar.cc/150?u=dr-abhinand-msg8",
        unread: 0,
        active: false,
    },
];

return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex">
        {/* Left Sidebar - Message Threads */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Messages</h2>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="Search by Name/ Hospital" className="pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {messageThreads.map((thread, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${thread.active ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={thread.avatar} alt={thread.name} />
                            <AvatarFallback>{thread.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                            <p className="font-semibold text-sm dark:text-gray-100">{thread.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{thread.specialty}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{thread.hospital}</p>
                        </div>
                        {thread.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {thread.unread}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Right Main Section - Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center shadow-sm">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.pravatar.cc/150?u=dr-abhinand-chat" alt="Dr. Abhinand Choudry" />
                    <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                    <p className="font-semibold text-lg dark:text-gray-100">Dr. Abhinand Choudry <span className="text-gray-500 dark:text-gray-400 text-sm">(Endocrinologist)</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">City Hospital</p>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end">
                {/* Date Separator */}
                <div className="text-center text-sm text-gray-400 my-4">
                    25/04/2025
                </div>

                {/* Example Incoming Message - This would typically be dynamic */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm max-w-lg self-start">
                    <p className="text-gray-700 dark:text-gray-300">Dear Dr. Abhinand Choudry (Endocrinologist)</p>
                    <p className="text-gray-700 dark:text-gray-300">City Hospital</p>
                    {/* Placeholder for message input - this will be the reply area below */}
                </div>
            </div>

            {/* Message Input Area */}
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="relative mb-4">
                    <Input placeholder="Type a message" className="w-full pr-12 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg" />
                </div>
                
                {/* Attached file display */}
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4 w-fit">
                    <span className="font-medium text-blue-700 flex items-center">
                        <span className="text-blue-600 mr-2">
                            <Paperclip className="h-4 w-4 inline-block -rotate-45" />
                        </span>
                        Photo <span className="text-gray-500 ml-2">250 KB</span>
                    </span>
                    <CircleX className="h-4 w-4 text-gray-500 cursor-pointer ml-3" /> 
                </div>

                {/* Patient Information */}
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
                    <p>Karthika Viswanath (42, Female)</p>
                    <p>NHS : 990 915 3955, DOB : 24 June, 1983</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                        <Paperclip className="h-4 w-4 -rotate-45" />
                        Attach
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Send message</Button>
                </div>
            </div>
        </div>
    </div>
  );
};
export default PatientMessages;