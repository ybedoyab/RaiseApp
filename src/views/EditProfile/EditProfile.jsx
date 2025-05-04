import './editProfile.css'
import Nav from '../../components/Nav/Nav'
import { useEffect, useState } from 'react';
import DefaultImg from '../../assets/honey.png';
import apiService from '../../api/apiService';
import WalletConnect from '../../components/WalletConnect';

const EditProfile = () => {
	const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		image: '',
		publicKey: ''
	});
	const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
		image: '',
		publicKey: ''
  });

	const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
	}

	useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
		if (user.image != null || user.image != "") {
			setImagePreview(user.image)
		}
    setUser(user);	
	}, []);

	useEffect(() => {
		const navbar = document.querySelector(".nav-bar");
		const header = document.querySelector(".edit-profile-container");
		
		if (navbar && header) {
			const navbarHeight = navbar.offsetHeight;
			header.style.paddingTop = `${navbarHeight+30}px`;
		}
	}, []);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
			setImageFile(file);
		} else {
			setImagePreview(null);
			setImageFile(null);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (formData.name.length > 0) {
			user.name = formData.name;
		}
		if (formData.email.length > 0) {
			user.email = formData.email;
		}
		if (formData.password.length > 0) {
			user.password = formData.password;
		}
		if (formData.publicKey.length > 0) {
			user.publicKey = formData.publicKey;
		}

		const user_id = JSON.parse(localStorage.getItem("user")).id;

		if (imageFile) {
			const imageFormData = new FormData();
			imageFormData.append("file", imageFile);

			apiService.uploadProfileImage(user_id, imageFormData)
				.then(imageUrl => {
					console.log('Imagen subida:', imageUrl);
					user.image = imageUrl;
					return apiService.updateUser(user_id, user);
				})
				.then(() => {
					console.log('Usuario actualizado');
					setUser(user);
					localStorage.setItem('user', JSON.stringify(user));
					alert('Usuario actualizado exitosamente');
					window.location.reload();
				})
				.catch(err => {
					console.error('Error:', err);
					alert('Error al actualizar el usuario');
				});
		} else {
			apiService.updateUser(user_id, user)
				.then(() => {
					console.log('Usuario actualizado');
					localStorage.setItem('user', JSON.stringify(user));
					alert('Usuario actualizado exitosamente');
					window.location.reload();
				})
				.catch(err => {
					console.error('Error:', err);
					alert('Error al actualizar el usuario');
				});
		}
	};

	return (
		<>
			<Nav />
			<div className='edit-profile-container'>
				<div className='edit-profile-form'>
					<h2>Profile Settings</h2>
					<form onSubmit={handleSubmit}>
						<div className='input-form'>
							<label htmlFor="name">Name: </label> 
							<input onChange={handleChange} type="text" name="name" id="name" placeholder={user.name.length > 0 ? user.name : "Edit your name"}/>
						</div>

						<div className='input-form'>
							<label htmlFor="email">Email: </label> 
							<input onChange={handleChange} type="mail" name="email" id="email" placeholder={user.email.length > 0 ? user.email : "Edit your email"}/>
						</div>

						<div className='input-form'>
							<label htmlFor="password">Password: </label> 
							<input onChange={handleChange} type="password" name="password" id="password" placeholder='Enter a new password'/>
						</div>

						<div className='input-form'>
							<label className='image-input' htmlFor="image">Profile pic: 
								<img src={imagePreview == null ? DefaultImg : imagePreview} alt="Preview" />
								<span>select file</span>
							</label> 
							<input type="file" name="image" id="image" accept="image/*" onChange={handleImageUpload}/>
						</div>

						<button className='btn-form'>Save Profile</button>
					</form>

					<div className="wallet-section">
						<h3>Wallet Connection</h3>
						<WalletConnect />
					</div>
				</div>
			</div>
		</>
	)
}

export default EditProfile