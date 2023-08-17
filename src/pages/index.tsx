import React, { useState } from 'react';
import { Input, Button, Space, Alert, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '@/models/User';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async () => {
    const loginPayload = {
      username: username,
      password: password,
    };

    const response = await fetch(`${process.env.AUTH_API_URL}/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ertis-Alias': process.env.MEMBERSHIP_ID!,
      },
      body: JSON.stringify(loginPayload),
    })

    const result = await response.json()
    if (response.status === 201) {
      const user = await whoAmI(result.access_token)
      if (user !== null) {
        setUser(user)

      const previousToken = Cookies.get('my_token');
      if (previousToken) {
        Cookies.remove('my_token');
      }

        const expirationTime = 60;
        Cookies.set('my_token', result.access_token, { expires: expirationTime / (24 * 60) });
      }
    }
    else {
      setErrorMessage(result.Message)
    }
  };

  const whoAmI = async (token: string): Promise<User | null> => {
    const response = await fetch(`${process.env.AUTH_API_URL}/whoami`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })

    if (response.status === 200) {
      return await response.json() as User
    }
    else {
      const result = await response.json()
      setErrorMessage(result.Message)
      return null
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {user ?
      <Card title={`${user.firstname} ${user.lastname}`} bordered={false} style={{ width: 300 }}>
        <Avatar size={64} icon={<UserOutlined />} />
        <p>Kullanıcı ID: {user._id}</p>
        <p>Kullanıcı E-posta: {user.email_address}</p>
        <p>Kullanıcı Adı: {user.username}</p>
        <p>Kullanıcı Rolü: {user.role}</p>
      </Card> :<>
        <Space wrap className='login-innfo flex flex-col space-y-2'>
          <Input type='text' className='w-64' placeholder="Kullanıcı adı" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input.Password type='password' className='w-64' placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && <Alert message={errorMessage} type="error" className='w-64' showIcon />}
          <Button className='bg-blue-500 text-white rounded-xl w-24' onClick={handleLogin}>Giriş</Button>
        </Space></>}
    </main>
  );
};

export default LoginPage;