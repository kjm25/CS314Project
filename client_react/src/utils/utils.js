

// Constants
import { DEBUGGING } from "../components/Constants"


export const clearInput = () => {
    const formInput = document.getElementById('newConversationInput')
    
    // Clear the input field
    formInput.value = ""

    // Removes the wrong-input class, if the wrong-input class is not 
    // present nothing happens.
    formInput.classList.remove("wrong-input")
}

export const formError = (message = "") => {
    if (DEBUGGING && message !== "")
        console.log (message)

    // Visually indicate wrong form entry
    document.getElementById('newConversationInput').classList.add("wrong-input")
}

export const clearFormError = () => {
    // Removes the wrong-input class, if the wrong-input class is not 
    // present nothing happens.
    document.getElementById('newConversationInput').classList.remove("wrong-input")
}

export const validEmailFormat = (str) => {
    // This is a regex pattern which helps identify email addresses.
    // Source :
    // https://regexr.com/3e48o
    const emailRegexValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    // Compare the string to the regex email pattern, if it matches 
    // a valid email, it returns true, otherwise false.
    return emailRegexValidator.test(str)
}

export const validArrayOfContacts = (contacts) => {
    // Base case, empty array
    if (contacts.length === 0)
          return false
      
    // Validate that each contact in the array is a valid email.
    for (const contact of contacts)
    {
        if (!validEmailFormat(contact))
            return false 
    }

    return true
}

export function stripEmail ( email )
{
    return email.split('@')[0]
}

export const parseContactsFromString = (str) => {
    // Deliminate the str by commas
    // For each element trim the whitespace
    // Set each element to lowercase
    return str.split(/[ ,]+/).map( (ele) => ele.trim().toLowerCase() )
}