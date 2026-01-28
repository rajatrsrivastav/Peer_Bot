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

export const deleteChatBot = async ({ name, token }) => {
    const headers = {
        "Content-Type": "application/json",
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch("/api/chatbot/delete", {
      method: "DELETE",
      body: JSON.stringify({ name }),
      headers,
    });
    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      throw new Error(err || "Error deleting chatbot");
    }
    return response.json();
};

export const updateChatBot = async ({ name, newName, context, token }) => {
    const headers = {
        "Content-Type": "application/json",
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch("/api/chatbot/update", {
      method: "PUT",
      body: JSON.stringify({ name, newName, context }),
      headers,
    });
    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      throw new Error(err || "Error updating chatbot");
    }
    return response.json();
};