module.exports = formData => {
  let errors = {
    hasErr: false
  };
  const { fullName, email, message } = formData;
  if (!fullName.trim().length) {
    errors = {
      hasErr: true,
      fullName: { message: 'Field "Name" is required.' }
    }
  }

  
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors = {
      ...errors,
      hasErr: true,
      email: { message: 'Email is invalid.' }
    }
  }
  
  if (!email.trim().length) {
    errors = {
      ...errors,
      hasErr: true,
      email: { message: 'Field "Email" is required.' }
    }
  }
  
  if (!message.trim().length) {
    errors = {
      ...errors,
      hasErr: true,
      message: { message: 'Field "Message" is required.' }
    }
  }
  return errors;
}