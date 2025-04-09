il dois comprendre la lie entre backend et fron-end dans ce cas 
```
const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

```
```
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/api/users/login/', {
            login_name: formData.loginName, 
            password: formData.password
        });

        if (response.data.requires_2fa) {
            // Rediriger vers la page 2FA avec les informations nécessaires
            navigate('/auth/two-factor', {
                state: {
                    email: formData.loginName,
                    tempToken: response.data.temp_token
                }
            });
        } else {
            // Login normal sans 2FA
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            setIsAuthenticated(true);
            navigate('/');
        }
    } catch (error) {
        setErrors({ 
            submit: error.response?.data?.message || 'Invalid credentials'
        });
    } finally {
        setIsLoading(false);
    }
};
```
- c est quoi hooks ?

- c est quoi usestate ?

- use Effect ?

- bien comprendre hooks create dans file UserContext  ?

- comprendre userProvide ? (routing)

- le chemant de sidbar et navbar ?

//------------

ajouter swager 
focus pour chat 