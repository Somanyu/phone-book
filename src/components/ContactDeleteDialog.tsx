import React, {useRef} from 'react';
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

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          {selectedContactId !== null &&
            contacts.map((contact) => {
              if (contact.id === selectedContactId) {
                return (
                  <div key={contact.id}>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete {contact.first_name}'s contact ?
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
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
