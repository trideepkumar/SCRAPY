const isNameValid = (value) => {
    const name = value?.trim()
    if (!name?.length > 0) {
      return false
    }
    return true
  }

  const isEmailValid = (value) => {
    const email = value?.trim()
    if (!email?.length) {
      return false
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false
    }
    return true
  }


  const isPasswordValid = (value) => {
    const password = value?.trim()
    if (!password?.length) {
      return false
    }
    return true
  }

  export const validateRegister = (user) => {
    const errors = {}
    if (!isNameValid(user.username)) {
      errors.username = "Please enter a valid  name"
    }
    if (!isEmailValid(user.email)) {
      errors.email = "Please enter a valid email"
    }
    if (!isPasswordValid(user.password)) {
      errors.password = "Please enter a valid password"
    }
    const isValid = !Object.keys(errors).length
    return {
      isValid,
      errors,
    }
  }
