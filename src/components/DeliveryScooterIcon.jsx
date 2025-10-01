import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define animations
const baja = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;
const baja3 = keyframes`
  0% { transform: translateY(3px); }
  50% { transform: translateY(0px); }
  100% { transform: translateY(3px); }
`;
const rueda = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Component Styles
const IconWrapper = styled.div`
  width: 192px;
  height: 192px;
  border-radius: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  .car {
    width: 80px;
    height: 50px;
    border: 3px solid #303744;
    background: #d7a453;  
    border-radius: 60px 60px 0 0;
  }
  .car.ani {
    transition: all .3s ease-in-out;
    animation: ${baja} 1.2s alternate infinite;
  }
  .car::before {
    content: "";
    position: absolute;
    width: 68px;
    height: 40px;
    background-image: linear-gradient(to bottom, rgba(235,241,246,1) 0%,rgba(224,238,249,0.3) 50%,rgba(213,235,251,0.3) 100%);  
    border-radius: 75px 75px 0 0;
    margin: 2px 11px;
  }
  .car::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 39px;
    background: #d7a453;
    border-radius: 75px 75px 0 0;
    margin: 3px 10px;
  }
  .car3 {
    position: absolute;
    width: 70px;
    height: 35px;
    border: 3px solid #303744;
    background: #d7a453;  
    border-radius: 600px 300px 300px 0;
    margin: 19px -21px;
    z-index: 333;
  }
  .car3::before {
    content: "";
    position: absolute;
    width: 60px;
    height: 35px;
    background-image: linear-gradient(to bottom, rgba(235,241,246,1) 0%,rgba(224,238,249,0.3) 50%,rgba(213,235,251,0.3) 100%);  
    border-radius: 600px 300px 300px 0;
    margin: 0px 10px;
  }
  .car3::after {
    content: "";
    position: absolute;
    width: 54px;
    height: 35px;
    background: #d7a453;
    border-radius: 600px 300px 300px 0;
    margin: 0px 10px;
  }
  .car7 {
    position: absolute;
    width: 55px;
    height: 7px;
    background: #d7a453;
    border: 3px solid #303744;
    border-radius: 12px;
    margin: 45px 37px;
  }
  .car7::before {
    content: "";
    position: absolute;
    width: 40px;
    height: 7px;
    background: #83736a;
    border: 3px solid #303744;
    border-radius: 12px;
    margin: -57px -25px;
  }
  .car9 {
    position: absolute;
    width: 5px;
    height: 14px;
    background: #303744;
    transform: rotate(-21deg);
    margin: 1px 2px;
  }
  .car9::before {
    content: "";
    position: absolute;
    width: 55px;
    height: 5px;
    transform: rotate(21deg);
    background: #303744;
    margin: -6px -39px;
  }
  .car9::after {
    content: "";
    position: absolute;
    width: 55px;
    height: 7px;
    background: #d7a453;
    border: 3px solid #303744;
    border-radius: 12px;
    transform: rotate(-45deg);
    margin: 54px 55px;
  }
  .campana {
    position: absolute;
    width: 45px;
    height: 25px;
    border-radius: 60px 60px 0 0;
    background: #8396ae;
    border: 3px solid #303744;
    margin: -37px -39px;
    transition: all .3s ease-in-out;
    animation: ${baja3} 1.2s alternate infinite;
  }
  .campana::before {
    content: "";
    position: absolute;
    width: 35px;
    height: 23px;
    border-radius: 60px 60px 0 0;
    background-image: linear-gradient(to bottom, rgba(235,241,246,1) 0%,rgba(224,238,249,0.7) 50%,rgba(213,235,251,0.7) 100%);  
    margin: 0px 7px;
  }
  .campana::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 23px;
    border-radius: 60px 60px 0 0;
    background: #abb7ce;
    margin: 0px 7px;
  }
  .campana3 {
    position: absolute;
    width: 50px;
    height: 5px;
    background: #8396ae;
    border: 2px solid #303744;
    margin: 25px -4px;
  }
  .campana3::before {
    content: "";
    position: absolute;
    width: 45px;
    height: 4px;
    background: #abb7ce;
    margin: 0px 4px;
  }
  .campana3::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background: #303744;
    margin: -36px 21px;
  }
  .rueda {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background: #495c77;
    border: 3px solid #303744;
    margin: 45px -9px;
    animation: ${rueda} 1.2s linear infinite;
  }
  .rueda::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: #eaeaea;
    border: 3px solid #303744;
    margin: 7px 6px;
  }
  .rueda::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 13px;
    background: #303744;
    margin: 9px 13px;
  }
`;

const DeliveryScooterIcon = () => {
  return (
    <IconWrapper>
      <div className="car ani">
        <div className="car3"></div>
        <div className="car7"></div>
        <div className="car9"></div>
        <div className="rueda"></div>
        <div className="campana">
          <div className="campana3"></div>
        </div>
      </div>
    </IconWrapper>
  );
};

export default DeliveryScooterIcon;
