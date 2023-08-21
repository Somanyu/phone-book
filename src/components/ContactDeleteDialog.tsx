import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from '@chakra-ui/react';
import { GoTrash } from 'react-icons/go';
import { useMutation } from '@apollo/client';

// Config files
import { DeleteContactPhone } from '../config/queries';
import { Contact } from '../config/types';
import { css } from '@emotion/react';

interface ContactDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  //   cancelRef: React.MutableRefObject<HTMLElement | null>;
  selectedContactId: number | null;
  contacts: Contact[]; // Make sure to define your Contact type
}

const ContactDeleteDialog: React.FC<ContactDeleteDialogProps> = ({
  isOpen,
  onClose,
  selectedContactId,
  contacts,
}) => {
  const toast = useToast(); // Chakra UI toast
  const cancelRef = useRef<HTMLButtonElement>(null); // Create a ref for the cancel button
  const [deleteContactPhone, { loading: deleteLoading }] = useMutation(DeleteContactPhone); // Mutation for deleting a contact

  const secondaryText = css`
    font-family: 'Nunito', sans-serif;
  `

  const primaryText = css`
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
  `

  const buttonStyle = css`
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    }
  `

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          {selectedContactId !== null &&
            contacts.map((contact) => {
              if (contact.id === selectedContactId) {
                return (
                  <div key={contact.id}>
                    <AlertDialogHeader css={primaryText} fontSize="lg" fontWeight="bold">
                      Delete {contact.first_name}'s contact ?
                    </AlertDialogHeader>
                    <AlertDialogBody css={secondaryText}>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button css={buttonStyle} ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        css={buttonStyle}
                        onClick={async () => {
                          try {
                            // Query to delete a contact
                            await deleteContactPhone({
                              variables: {
                                id: selectedContactId,
                              },
                            });

                            // Show toast for successful contact deletion
                            toast({
                              title: 'Contact Deleted',
                              description: 'Contact has been successfully deleted.',
                              status: 'success',
                              position: 'top',
                              duration: 3500,
                              isClosable: true,
                            });

                            onClose();
                          } catch (error) {
                            console.error('Error deleting contact:', error);
                          }
                        }}
                        isLoading={deleteLoading}
                        leftIcon={<GoTrash />}
                        colorScheme="red"
                        variant="solid"
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </div>
                );
              }
              return null;
            })}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ContactDeleteDialog;
