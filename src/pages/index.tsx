import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const apiUrl = 'http://localhost:9716/api/v1/generate-token';
    const membershipId = '64b91e2c4e140f52b0e3685a'

    const loginPayload = {
      username: username,
      password: password,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ertis-Alias': membershipId,
      },
      body: JSON.stringify(loginPayload),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <Space wrap className='login-innfo flex flex-col space-y-2'>
        <Input type='text' className='w-64' placeholder="Kullanıcı adı" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <Input.Password type='password' className='w-64' placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className='bg-blue-500 text-white rounded-xl w-24' onClick={handleLogin}>Giriş</Button>
      </Space>
    </main>
  );
};

export default LoginPage;

