import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
// import fetchApi from '../services/FetchApi';
import { Form } from 'react-router-dom';
import axios from 'axios';


const TicketDetailsModal = ({ ticketId, show, onClose }) => {
    // const siteUrl = 'https://daroomokamel.ir'


    const [ticketData, setTicketData] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWrite, setIsWrite] = useState();
    const [formData, setFormData] = useState({
        newMessage: '',
        attachment: null,

    });
    // let Home_URL = window?.nvApiSettings?.home;
    let Home_URL = "https://daroomokamel.ir/plugintest/"



    // let Home_URL = window?.nvApiSettings?.home;
    // let Home_URL = "https://daroomokamel.ir/plugintest/"
    // Fetch the ticket details and messages
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                if (ticketId && show) {
                    console.log('Fetching ticket data with:', { ticketId, show });

                    const response = await axios.get(Home_URL + `wp-json/Nv-adminTickets/v1/tickets/${ticketId}`);
                    console.log('Response received:', response.data);
                    setTicketData(response.data);
                    setIsWrite(response.data.ticketInfo.client_id)
                    console.log('isWrite', isWrite)
                } else {
                    console.log('Conditions not met for fetching data:', { ticketId, show });
                }
            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchTicketData();
    }, [ticketId, show]);



    // const handleAddMessage = async () => {
    //     if (newMessage.trim()) {
    //         setIsSubmitting(true);
    //         let api = Home_URL + 'wp-json/Nv-adminTickets/v1/tickets/'
    const handleAddMessage = async () => {
        if (newMessage.trim()) {
            setIsSubmitting(true);
            let api = Home_URL + 'wp-json/Nv-adminTickets/v1/tickets/'
            const formDataInput = new FormData()
            // formDataInput.append('Ticket_department', formData.departmentId)
            // formDataInput.append('Ticket_title', formData.subject)
            formDataInput.append('msg', formData.message)
            formDataInput.append('attachment', formData.attachment)
            try {
                await axios.post(`${api + ticketId}`, formDataInput);
                setNewMessage('');
                // const updatedData = await axios.get(`${api + ticketId}`);
                const updatedData = await axios.get(`${api + ticketId}`);
                setTicketData(updatedData.data);
                onClose()

            } catch (error) {
                console.error('Error adding message:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleChange = (e) => {
        console.log('eeeeeeeeeeeeee', e)
        setNewMessage(e.target.value)
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    if (!ticketData) return null;

    return (
        <>
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 overflow-auto">
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4"
                        style={{ height: '80%' }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b p-4">
                                <h2 className="text-lg font-semibold">
                                    {ticketData.ticketInfo.title || 'جزئیات تیکت'}
                                </h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                                    &times;
                                </button>
                            </div>
                            {/* Content */}
                            <div className="flex-1 justify-end p-4 overflow-y-auto">
                                <div className="mb-4">
                                    <h5 className="font-medium">نام مشتری: {ticketData.ticketInfo.clientName}</h5>
                                    <p>دپنارتمان: {ticketData.ticketInfo.department_title}</p>
                                    <p>وضعیت: {ticketData.ticketInfo.status}</p>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <div className="flex flex-col space-y-3 mb-4">
                                        <h6 className="font-semibold">گفتگو</h6>
                                        {ticketData.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`message p-2 rounded-md shadow-sm ${isWrite !== msg.user_id
                                                    ? 'bg-blue-100 text-right self-start'
                                                    : 'bg-gray-100 text-right self-end'
                                                    }`}
                                            >
                                                <p>{msg.body}</p>
                                                {msg.attachmentURL && (
                                                    <a
                                                        href={msg.attachmentURL}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        <FontAwesomeIcon icon={faPaperclip} /> پیوست
                                                    </a>
                                                )}
                                                <small className="text-gray-500">{msg.date}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* New message and Attachment Field at the top of the footer */}
                            <div className="flex justify-end space-x-2 p-4 gap-2">
                                <div className="flex-1">
                                    <textarea
                                        placeholder="پیام جدید را اضافه کنید"
                                        name="message"
                                        value={newMessage}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md mb-2"
                                    />
                                    <label className="block text-sm font-medium text-gray-700">پیوست</label>
                                    <input
                                        type="file"
                                        name="attachment"
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>


                            </div>
                            <div className="flex justify-end space-x-2 p-4 gap-2 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleAddMessage}
                                    disabled={isSubmitting}
                                    className={`h-10 px-3 rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                                >
                                    {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

};

export default TicketDetailsModal;
