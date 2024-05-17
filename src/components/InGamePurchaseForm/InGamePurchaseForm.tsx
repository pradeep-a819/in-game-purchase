"use client";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./InGamePurchaseForm.module.css";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface InAppPurchaseSubmitForm {
  envUrl: string;
  gameId: string;
  userId: string;
  itemName: string;
  itemDescription: string;
  denominator: string;
  amountType: string;
  amount: number;
}

type WebhookData = {
  [key: string]: any;
};

const InGamePurchaseForm: React.FC = () => {
  const amountOptions: any = ["ADA", "FIAT"];
  const envsList: any = [
    "https://platform-dev.rflxt.com",
    "https://platform-uat.rflxt.com",
    "https://platform-staging.rflxt.com",
    "https://beta.rflxt.com",
  ];

  const [AmountType, setAmountType] = useState<string>("ADA");
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);

  const schema = yup.object().shape({
    envUrl: yup.string().required("Please select env"),
    gameId: yup.string().required("Game Id is required"),
    userId: yup.string().required("User Id is required"),
    itemName: yup.string().required("Item Name is required"),
    itemDescription: yup.string().required("Item Description is required"),
    denominator: yup.string().required("Denominator is required"),
    amountType: yup.string().required("amount type is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .typeError("Amount is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<InAppPurchaseSubmitForm>({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const envurl: string = getValues("envUrl");

  const handleIngamePurchaseForm = async () => {
    const formInput: any = {
      gameId: getValues("gameId"),
      idempotencyId: "2cb9d534-4d64-4219-8275-47684e25775c",
      itemName: getValues("itemName"),
      itemDescription: getValues("itemDescription"),
      denominator: getValues("denominator"),
      userId: getValues("userId"),
      webHookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL,
      itemImageUrl: "https://loremflickr.com/640/480",
      transactionType: "In Game Purchase",
    };

    AmountType === "ADA"
      ? (formInput["adaAmount"] = getValues("amount"))
      : (formInput["fiatAmount"] = getValues("amount"));

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      const paymentId: any = await axios.post(
        `${envurl}/api/payments/new`,
        formInput,
        {
          headers,
        }
      );
      localStorage.setItem("transactionId", paymentId?.data?.id);
      const result = await axios.post(
        `${envurl}/api/payments/game`,
        {
          paymentTransactionId: paymentId?.data?.id,
        },
        {
          headers,
        }
      );
      reset();
      window.open(
        `${result?.data?.paymentUrl}`,
        "customWindow",
        "width=600, height=775, top=100, left=600, popup=yes"
      );
      fetchData();
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const handleAmountType = (e: any) => {
    setAmountType(e.target.value);
    setValue("amountType", e.target.value);
  };

  async function fetchData() {
    try {
      const response = await fetch("/api/getWebhookData");
      const result = await response.json();
      setWebhookData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    setValue("amountType", "ADA");
    const intervalId = setInterval(fetchData, 10000); // Call fetchData every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <div className={styles.formPage}>
      <ToastContainer />
      <div className={styles.formContainer}>
        <h1 className={styles.header}>In-Game Purchase</h1>
        <div className={styles.inputContainer}>
          <label>Environment:</label>
          <select
            data-testid="Amount"
            className={styles.selectDropdown}
            {...register("envUrl")}
          >
            {envsList.map((items: any) => (
              <option
                key={items}
                className={styles.notesOption}
                value={items.value}
              >
                {items}
              </option>
            ))}
          </select>
          {errors?.envUrl && (
            <span className={styles.error}>{errors?.envUrl?.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>Game Id:</label>
          <input
            placeholder="Enter Game Id"
            className={styles.inputField}
            {...register("gameId")}
          />
          {errors?.gameId && (
            <span className={styles.error}>{errors?.gameId?.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>User Id:</label>
          <input
            placeholder="Enter User Id"
            className={styles.inputField}
            {...register("userId")}
          />
          {errors?.userId && (
            <span className={styles.error}>{errors?.userId?.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>Item Name:</label>
          <input
            placeholder="Enter Item Name"
            className={styles.inputField}
            {...register("itemName")}
          />
          {errors?.itemName && (
            <span className={styles.error}>{errors?.itemName?.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>Item Description:</label>
          <input
            placeholder="Enter Item Description"
            className={styles.inputField}
            {...register("itemDescription")}
          />
          {errors?.itemDescription && (
            <span className={styles.error}>
              {errors?.itemDescription?.message}
            </span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>Denominator:</label>
          <select
            data-testid="Denominator"
            className={styles.selectDropdown}
            {...register("denominator")}
          >
            {amountOptions.map((items: any) => (
              <option key={items} className={styles.notesOption}>
                {items}
              </option>
            ))}
          </select>
          {errors?.denominator && (
            <span className={styles.error}>{errors?.denominator?.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>Amount Type:</label>
          <select
            data-testid="Amount"
            className={styles.selectDropdown}
            onChange={handleAmountType}
            //   {...register("amountType")}
          >
            {amountOptions.map((items: any) => (
              <option key={items} className={styles.notesOption}>
                {items}
              </option>
            ))}
          </select>
          {errors?.amountType && (
            <span className={styles.error}>{errors?.amountType.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <label>{AmountType} Amount:</label>
          <input
            type="number"
            placeholder="Enter Amount"
            className={styles.inputField}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            {...register("amount")}
          />
          {errors?.amount && (
            <span className={styles.error}>{errors?.amount?.message}</span>
          )}
        </div>
        <div className={styles.btnContainer}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit(handleIngamePurchaseForm)}
          >
            Submit
          </button>
          <button className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
      <div className={styles.transactionContainer}>
        {webhookData.length > 0 ? (
          webhookData.map(
            (data, index) =>
              data.transactionid === localStorage.getItem("transactionId") && (
                <div key={index} className={styles.card}>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )
          )
        ) : (
          <p className={styles.header}>transaction status will be shown here</p>
        )}
      </div>
    </div>
  );
};

export default InGamePurchaseForm;
