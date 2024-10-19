import { useEffect, useRef, useState } from "react";
import Input from "./Input/Input";
import Button from "./Button/Button";
import e from "express";

interface ChatProps {
    id: number;
}

interface Question {
    query: string
}

const ChatBot: React.FC<ChatProps> = (id) => {
    const [openChat, setOpenChat] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<string[]>([]);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleOpenChat = () => {
        console.log('test')
        setOpenChat(true)
    }

    const handleCloseChat = () => {
        setOpenChat(false)

    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('test')

        if (message.trim()) {  
            setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);

            await addChat(message);

            setMessage('');
        }
    }

    const addChat = async (m: string) => {
        const question: Question = {
            query: m
          };

          console.log(question)

        try {
            const response = await fetch(`${url}/ai/${id.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(question),
            });

            const result = await response.json();

            console.log(result.data)
            const message = result.data;

            setMessages((prevMessages) => [...prevMessages, `Bot: ${message}`]);

        } catch (error) {

        }
    }

    return (
        <div>
            {!openChat ?
                (
                    <div style={
                        { position: 'fixed', top: '93.3%', left: '78%', backgroundColor: '#2C3E50', width: '350px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: 'white' }
                    } onClick={handleOpenChat}>
                        <h3>ChatBot</h3>
                    </div>
                ) :
                (
                    <div style={{ position: 'fixed', top: '50.2%', left: '78%', }}>
                        <div style={{ backgroundColor: '#2C3E50', width: '350px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: 'white' }} onClick={handleCloseChat}
                        >
                            <h3>ChatBot</h3>
                        </div>
                        <div style={
                            { position: 'fixed', width: '350px', height: '412px', backgroundColor: '#B6AFAF', display: "flex", justifyContent: 'center' }
                        }>
                            <div id="test" style={{ width: '300px', maxHeight: ' 350px', position: 'absolute', overflowY: 'auto', display: 'flex', flexDirection: 'column', marginTop: '5px' }}
                            >
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        <p>{msg}</p>
                                    </div>
                                ))}
                                <div ref={endOfMessagesRef} />
                            </div>
                            <form
                                action=""
                                style={{ position: 'absolute', top: '86%', left: '5%', display: "flex", gap: '5px', alignItems: 'center', justifyContent: 'center' }}
                                onSubmit={handle}
                            >
                                <Input
                                    style={{ width: '227px' }}
                                    placeholder="Digite a sua mensagem..."
                                    onChange={handleInput}
                                    value={message}
                                />
                                <button
                                    type="submit"
                                    style={{ width: '60px', height: '38px' }}
                                ></button>
                            </form>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

export default ChatBot;