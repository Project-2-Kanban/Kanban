import { useEffect, useRef, useState } from "react";
import Input from "./Input/Input";
import Button from "./Button/Button";
import e from "express";
import { marked } from "marked";

interface ChatProps {
    id: string;
}

interface Question {
    query: string
}

const ChatBot: React.FC<ChatProps> = (id) => {
    const [openChat, setOpenChat] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<string[]>([]);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleOpenChat = () => {
        setOpenChat(true)
    }

    const handleCloseChat = () => {
        setOpenChat(false)

    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('')

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

        setLoading(true);

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

            const message = result.data;
            console.log(result)

            const formattedMessage = marked(message);

            setMessages((prevMessages) => [...prevMessages, `Bot: ${formattedMessage}`]);

        } catch (error) {

        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    }

    return (
        <div>
            {!openChat ?
                (
                    <div style={
                        { position: 'fixed', bottom: '20px', right: '40px', backgroundColor: '#2C3E50', width: '350px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: 'white' }
                    } onClick={handleOpenChat}>
                        <h3>ChatBot</h3>
                    </div>
                ) :
                (
                    <div style={{ position: 'fixed', bottom: '432px', right: '40px' }}>
                        <div style={{ backgroundColor: '#2C3E50', width: '350px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px 10px 0 0', cursor: 'pointer', color: 'white' }} onClick={handleCloseChat}
                        >
                            <h3>ChatBot</h3>
                        </div>
                        <div style={
                            { position: 'fixed', width: '350px', height: '412px', backgroundColor: '#B6AFAF', display: "flex", justifyContent: 'end' }
                        }>
                            <div id="test" style={{ width: '300px', maxHeight: ' 350px', position: 'absolute', overflowY: 'auto', display: 'flex', flexDirection: 'column', marginTop: '5px', marginRight: '10px' }}
                            >
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        {msg.includes('Bot:') ?
                                            (<p style={{ backgroundColor: '#99c6d8', padding: '10px', borderRadius: '10px 0 10px 10px', marginRight: '30px' }} dangerouslySetInnerHTML={{ __html: msg.replace('Bot: ', '') }}></p>) :
                                            (<p style={{ backgroundColor: 'white', padding: '10px', borderRadius: '0 10px 10px 10px', marginRight: '30px' }}>{msg}</p>)}
                                    </div>
                                ))}
                                {loading && (
                                    <p
                                        style={{
                                            backgroundColor: '#99c6d8',
                                            padding: '10px',
                                            borderRadius: '0 10px 10px 10px',
                                            marginRight: '30px',
                                        }}
                                    >
                                        Escrevendo...
                                    </p>
                                )}
                                <div ref={endOfMessagesRef} />
                            </div>
                            <form
                                action=""
                                style={{ position: 'absolute', bottom: '0', left: '5%', display: "flex", gap: '5px', alignItems: 'center', justifyContent: 'center' }}
                                onSubmit={handle}
                            >
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', backgroundColor: 'white', borderRadius:'10px', height:'50px', marginBottom:'10px'}}>
                                    <Input
                                        style={{ width: '247px',border:'none', paddingTop:'16px', fontSize:'15px' }}
                                        placeholder="Digite a sua mensagem..."
                                        onChange={handleInput}
                                        value={message}
                                    />
                                    <Button
                                        type="submit"
                                        style={{ width: '40px', height: '38px', backgroundColor: 'white', color: 'rgb(44, 62, 80)',borderRadius:'100px' }}
                                        icon="send"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

export default ChatBot;