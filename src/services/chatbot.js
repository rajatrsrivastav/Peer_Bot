export const getChatBots=async({token})=>{
    const headers = {
        "Content-Type":"application/json",
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response =await fetch("/api/chatbot/getByCreator",{
        method:"GET",
        headers,
    })
    if(!response.ok){
        const{err}=await response.json()
        console.log(err)
        throw new Error(err || "Error getting chatbot")
    }
    return response.json()
}
export const createChatBot = async({name,context,token}) => {
    const headers = {
        "Content-Type":'application/json',
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response =await fetch("/api/chatbot/create",
        {
            method:"POST",
            body:JSON.stringify({name,context}),
            headers,
        }
    )
    if (!response.ok){
        const{err}=await response.json()
        console.log(err)
        throw new Error (err || "Error Creating Chatbot")
    }
  return response
}
export const getChatbotByName = async ({ name, token }) => {
    const headers = {
        "Content-Type": "application/json",
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(`/api/chatbot/getByChatbotName?name=${name}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      throw new Error(err || "Error getting chatbot");
    }
    return response.json();
  };