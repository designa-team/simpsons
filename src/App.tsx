import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { toJpeg } from 'html-to-image';
import Image1 from './assets/male_1.png';
import Image2 from './assets/male_2.png';
import Image3 from './assets/male_3.png';
import Image4 from './assets/female_1.png';
import Image5 from './assets/female_2.png';
import Image6 from './assets/female_3.png';
import Swal from 'sweetalert2';

type Color = {
  color: string;
  label: string;
}

type ProfilePic = {
  [key:string]: string;
  name: string;
  gender: string;
  background: string;
  ribbon: string;
  image: any;
}

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const { Option } = Select;
  const images_males = [
    Image1, Image2, Image3
  ];
  const images_females = [
    Image4, Image5, Image6
  ];
  const [loading, setLoading] = useState(false);
  const colors: Color[] = [
    {
      color: 'blue',
      label: 'Azul'
    },
    {
      color: 'red',
      label: 'Rojo'
    },
    {
      color: 'white',
      label: 'Blanco'
    },
    {
      color: 'yellow',
      label: 'Amarillo'
    },
    {
      color: 'green',
      label: 'Verde'
    },
    {
      color: 'purple',
      label: 'Morado'
    },
  ];

  const getRandomColor = () => {
    return colors[ Math.floor(Math.random()*colors.length) ].color;
  }
  
  const [profile, setProfile] = useState<Partial<ProfilePic>>({
  });

  useEffect(()=>{
    createRandom();
  }, []);

  const onChange = async (value:string, field:string) => {
    const data = {...profile};
    data[field] = value;
    if(field == 'gender'){
      setLoading(true);
      Swal.fire("Cargando...");
      Swal.showLoading();
      data['image'] = data.gender == 'male' ? getRandomImage(images_males, data['image'] ? data['image'] : '')  : getRandomImage(images_females, data['image'] ? data['image'] : '');
    }
    setProfile({...data});
  }


  const createRandom = async () => {
    let data:ProfilePic = {
      gender: profile.gender ? profile.gender : ['female','male'][ Math.floor(Math.random()*2) ],
      name: profile.name ? profile.name : 'Mi nombre',
      ribbon: getRandomColor(),
      background: getRandomColor(),
      image: ''
    };
    setLoading(true);
    Swal.fire("Cargando...");
    Swal.showLoading();
    data['image'] = data.gender == 'male' ? getRandomImage(images_males, profile['image'] ? profile['image'] : '')  : getRandomImage(images_females, profile['image'] ? profile['image'] : '');
    setProfile({...data})
  }

  const getRandomImage:any = ( images:string[], previous_image:string ) => {
    const image = images[ Math.floor(Math.random()*images.length) ];
    if( image != previous_image ){
      return image;
    }else{
      return getRandomImage( images, previous_image);
    }
  }

  const downloadImage = () => {
    if (ref.current === null) {
      return
    }

    toJpeg(ref.current, { cacheBust: true, })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = 'demo.jpg'
      link.href = dataUrl
      link.click()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const imageLoaded = () => {
    console.log("Cargado");
    Swal.close();
    setLoading(false);
  }

  return (
    <div className="App">
      <Row>
        <Col xs={{span:22, offset:1}} md={{span:20, offset:2}}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <div className="options">
                <Form.Item label="Género:">
                  <Select onChange={(e:string)=>onChange(e,'gender')} value={profile.gender}>
                    <Option> </Option>
                    <Option value="female">Femenino</Option>
                    <Option value="male">Masculino</Option>
                  </Select>
                </Form.Item>
                {/*<Form.Item label="Color de fondo:">
                  <Select onChange={(e:string)=>onChange(e,'background')} value={profile.background}>
                    <Option> </Option>
                    {
                      colors.map((color:Color, key:number)=>(
                        <Option value={color.color} key={key}>{color.label}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="Color de ribbon:">
                  <Select onChange={(e:string)=>onChange(e,'ribbon')} value={profile.ribbon}>
                    <Option> </Option>
                    {
                      colors.map((color:Color, key:number)=>(
                        <Option value={color.color} key={key}>{color.label}</Option>
                      ))
                    }
                  </Select>
                  </Form.Item>*/}
                <Form.Item label="Nombre:">
                  <Input onChange={(e:React.ChangeEvent<HTMLInputElement>)=>onChange(e.target.value,'name')} value={profile.name}></Input>
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Button type='primary' onClick={createRandom}>Generar nuevo personaje</Button>
                  </Col>
                  <Col xs={24} md={12}>
                    <Button type='default' onClick={downloadImage}>Descargar</Button>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div ref={ref} className="profile" style={{display: loading ? "none" : "block"}}>
                <div className="background" style={{backgroundColor:profile.background}}></div>
                <div className="image">
                  <img src={profile.image} onLoad={imageLoaded}></img>
                </div>
                <div className="ribbon" style={{backgroundColor:profile.ribbon}}>
                  <h1>{
                    profile.name
                  }</h1>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default App;
