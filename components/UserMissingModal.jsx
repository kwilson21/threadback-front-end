import { useMutation } from "graphql-hooks";
import { refreshThreadsMutation } from "../queries/refreshThreadsMutation";
import { Modal, useToasts } from "@zeit-ui/react";
import { useState } from "react";
import { User } from "@zeit-ui/react-icons";
import Router from "next/router";

export default function UserMissingModal(props) {
  const { visible, setVisible, bindings } = props;
  const { username } = props;
  const [toasts, setToast] = useToasts();
  const [refreshUser, { loading, error, data }] = useMutation(
    refreshThreadsMutation,
    {
      variables: { username: username },
    }
  );

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  const handleClick = () => {
    refreshUser();
    if (error) {
      setVisible(false);
      Router.push("/");
    } else {
      setVisible(false);
      Router.push(`/user/${username}`);
    }
  };

  return (
    <Modal {...bindings}>
      <Modal.Title>User does not exist</Modal.Title>
      <Modal.Subtitle>
        <User />
      </Modal.Subtitle>
      <Modal.Content>
        <p>
          We do not have any threads from {username}. Would you like to back up
          this user's threads?
        </p>
      </Modal.Content>
      <Modal.Action onClick={handleClick}>Yes</Modal.Action>
    </Modal>
  );
}
