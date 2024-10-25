import { useEffect, useRef, useState } from "react";
import Input from "./Input/Input";
import Button from "./Button/Button";
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
                            <div id="test" style={{ width: '300px', maxHeight: ' 340px', position: 'absolute', overflowY: 'auto', display: 'flex', flexDirection: 'column', marginTop: '10px', marginRight: '10px', paddingRight:'15px' }}
                            >
                                <p style={{ backgroundColor: '#99c6d8', padding: '10px', borderRadius: '10px 0 10px 10px', marginRight: '30px', margin:'0 0 10px 0'  }}>Olá, eu sou seu assistente vitual! Em que posso lhe ajudar?</p>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        {msg.includes('Bot:') ?
                                            (<p style={{ backgroundColor: '#99c6d8', padding: '0.1px 10px', borderRadius: '10px 0 10px 10px', marginRight: '30px', margin:'0 0 10px 0',width:'fit-content' }} dangerouslySetInnerHTML={{ __html: msg.replace('Bot: ', '') }}></p>) :
                                            (<p style={{ backgroundColor: 'white', padding: '10px', borderRadius: '0 10px 10px 10px', marginRight: '30px', margin:'0 0 10px 0' }}>{msg}</p>)}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="dots" style={{display:'flex', gap:'2px', backgroundColor: '#99c6d8', padding: '13px', borderRadius: '0 10px 10px 10px', marginRight: '30px', width:'fit-content'}}>
                                        <div className="dot" style={{animation:'jump 0.6s 0ms linear infinite'}}></div>
                                        <div className="dot" style={{animation:'jump 0.6s 100ms linear infinite'}}></div>
                                        <div className="dot" style={{animation:'jump 0.6s 200ms linear infinite'}}></div>
                                    </div>
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