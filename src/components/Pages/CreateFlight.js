import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "antd/dist/antd.css";
import { Layout, Form, Input, Button, Card, InputNumber, Modal } from "antd";
import SmartInsurance from "../../blockchain/abis/SmartInsurance.json";

const { Content, Footer } = Layout;

const { TextArea } = Input;

const initialFormData = Object.freeze({
  flightCode: "",
  flightDate: "2020-11-30",
  walletAddress: "0x00",
});

function Insurance() {
  const [visible, setVisible] = useState(false);
  const [block, setBlock] = useState([]);
  const [averageGasPrice, setAverageGasPrice] = useState(0);
  const [currentAddress, setCurrentAddress] = useState(0x00);
  const [formData, setFormData] = useState(initialFormData);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  const web3 = new Web3(Web3.givenProvider);
  useEffect(() => {
    // Get average gas price
    web3.eth
      .getGasPrice()
      .then((price) => {
        console.log(`Average gas price: ${price}`);
        setAverageGasPrice(price);
      })
      .catch(console.error);
    // Get latest block
    web3.eth.getBlock("latest").then(setBlock);
    window.ethereum.enable().then((account) => {
      const defaultAccount = account[0];
      web3.eth.defaultAccount = defaultAccount;
      setCurrentAddress(defaultAccount);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function DeployContractButton() {
    const deploySmartFlightInsurance = () => {
      // Deploying contract should be done through our backend service
      const creditLetter = new web3.eth.Contract(SmartInsurance.abi);
      creditLetter
        .deploy({
          data: `${SmartInsurance.bytecode}`,
          arguments: [
            web3.utils.toHex(formData.flightCode), // need to toHex
            web3.utils.toHex(formData.flightDate),
          ],
        })
        .send({
          from: currentAddress,
          gas: 1588000,
        });
    };
    return (
      <Button type="primary" onClick={deploySmartFlightInsurance}>
        Create Flight Insurance
      </Button>
    );
  }

  return (
    <>
      <Layout className="layout">
        <Content style={{ padding: "0 50px" }}>
          <h1 style={{ marginTop: 10 }}>Create Flight Insurance ✈️</h1>
          <Form
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
          >
            <Form.Item label="Flight Number">
              <Input name="flightCode" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Flight Details">
              <Card border="true" size="small">
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                  layout="horizontal"
                >
                  <Form.Item label="Date of Departure">31/12/2020</Form.Item>
                  <Form.Item label="From">Singapore</Form.Item>
                  <Form.Item label="To">Hong Kong</Form.Item>
                </Form>
              </Card>
            </Form.Item>

            {/* <Form.Item label="Pax">
                                <InputNumber
                                    defaultValue={1}
                                    min={1}
                                />
                            </Form.Item> */}

            <Form.Item label="Premium">
              <InputNumber
                defaultValue={0}
                min={0}
                formatter={(value) =>
                  `${value} ETH`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item label="Ratio">
              <InputNumber defaultValue={0} min={1} />
            </Form.Item>

            <Form.Item label="Payout Coverage">
              <InputNumber
                defaultValue={0}
                min={0}
                formatter={(value) =>
                  `${value} ETH`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item>
              <DeployContractButton />
            </Form.Item>
          </Form>
          <Modal
            title="⚠️ Proceed Payment"
            visible={visible}
            // onOk={this.handleOk}
            // onCancel={this.handleCancel}
          >
            <p>
              You are about to make a payment of $2000 from your wallet
              (0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B)
            </p>
            <p>Do you want to proceed?</p>
          </Modal>
        </Content>
        <Footer />
      </Layout>
    </>
  );
}

export default Insurance;
