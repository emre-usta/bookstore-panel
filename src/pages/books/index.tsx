import React, { useState } from 'react';
import { GetServerSideProps } from "next"
import Cookies from 'js-cookie';
import { Table, Modal, Button, Form, Input, InputNumber, message } from 'antd'
import { Book } from "@/models/Book"
import type { ColumnsType } from 'antd/es/table';

type BooksProps = {
	books: Book[],
	errorMessage?: string
}

const Books = (props: BooksProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [author, setAuthor] = useState<string>();
	const [price, setPrice] = useState<number | null>();

	const columns: ColumnsType<Book> = [
		{
			title: 'Adı',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <span>{text}</span>
		},
		{
			title: 'Yazar',
			dataIndex: 'author',
			key: 'author',
			render: (text) => <span>{text}</span>
		},
		{
			title: 'Fiyat',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => <span className={price > 15 ? "text-red-500" : price < 10 ? "text-green-500" : ""}>{price}</span>
		},
		{
			title: '',
			key: 'options',
			render: () => <Button type="primary" danger={true}>Sil</Button>
		},
	]

	const handleOk = () => {
		createBook();
	};
	
	  const handleCancel = () => {
		setIsModalOpen(false);
	};

	

	const createBook = async () => {
		const book = {
			name: name,
			author: author,
			price: price
		};
		
		const token = Cookies.get('my_token');
		console.log(process.env.BOOKSTORE_API_URL)

		const response = await fetch(`${process.env.BOOKSTORE_API_URL}`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(book),
		})
		
		if(response.status === 201){
			message.success('Kitap başarıyla oluşturuldu')
			setIsModalOpen(false);
		}
		else{
			message.error('Kitap oluşturulamadı')
			console.log(response)
		}
	}
		

	return (
		<div className="max-w-7xl mx-auto py-12">
			{props.errorMessage && <p>{props.errorMessage}</p>}
			<Button onClick={()=>setIsModalOpen(true)}>Kitap Oluştur</Button>
			<Table columns={columns} dataSource={props.books} />
			<Modal cancelText='İptal' okText='Kaydet' title="Kitap Oluştur" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        		<Form>
					<Form.Item label="Kitap Adı">
						<Input value={name} onChange={(e) => setName(e.target.value)} ></Input>
					</Form.Item>
					<Form.Item label="Yazar">
						<Input value={author} onChange={(e) => setAuthor(e.target.value)}></Input>
					</Form.Item>
					<Form.Item label="Fiyat">
						<InputNumber value={price} onChange={(e) => setPrice(e)} min={0} max={100} step={0.5}></InputNumber>
					</Form.Item>
				</Form>
      		</Modal>
		</div>
	)
}

export default Books

export const getServerSideProps: GetServerSideProps<BooksProps> = async (context) => {
	const token = context.req.cookies['my_token'];
	
	const response = await fetch(`${process.env.BOOKSTORE_API_URL}`,{
	  method: 'GET',
	  headers: {
		'Authorization': `Bearer ${token}`,
	  }
	})
	
	if (response.status === 200) {
		const books = await response.json() as Book[];
		return {
			props: {
				books
			},
			notFound: false
		}
	} else {
		const result = await response.json();
		return {
			props: {
				books: [],
				errorMessage: result.Message || "Something went wrong!"
			},
			notFound: false
		}
	}
	
};
