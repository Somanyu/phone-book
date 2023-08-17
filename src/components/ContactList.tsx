import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Avatar, Badge, Stack, Button, Center, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Card, CardBody, Heading, HStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { GoTrash, GoPencil, GoHeart, GoPersonAdd } from "react-icons/go";

// Config files
import client from '../config/apolloClient';
import { GetContactList } from '../config/queries';
import { Contact } from '../config/types';

type Props = {}

const ContactList = (props: Props) => {

    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const pageSize = 10; // Number of rows per page

    const getContacts = async () => {
        const { data } = await client.query({
            query: GetContactList,
        });

        setContacts(data.contact);
    };

    useEffect(() => {
        getContacts();
    }, []);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const onOpenModal = (contactId: number) => {
        setSelectedContactId(contactId);
        onOpen();
    };

    return (
        <div>
            <HStack mb={10} mt={'10'} justify={'center'}>
                <Heading textAlign={'center'}>Contact List</Heading>
                {/* <AddContactModal /> */}
                <Link to='/add/contact'>
                    <Button size={'sm'} ml={'3'} leftIcon={<GoPersonAdd />} colorScheme='whatsapp' variant='solid'>
                        Add Contact
                    </Button>
                </Link>
            </HStack>

            <Center>
                <Card>
                    <CardBody>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Profile</Th>
                                        <Th>Name</Th>
                                        <Th>Phone Numbers</Th>
                                        <Th textAlign={'center'}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {contacts.slice(startIndex, endIndex).map((contact) => (
                                        <Tr key={contact.id}>

                                            <Td><Avatar name={`${contact.first_name} ${contact.last_name}`} src={`https://api.dicebear.com/6.x/lorelei/svg?seed=${contact.first_name}`} /></Td>

                                            <Td>{contact.first_name} {contact.last_name}</Td>

                                            <Td>
                                                {contact.phones && contact.phones.length > 0 ? (
                                                    <Popover trigger='hover'>
                                                        <PopoverTrigger>
                                                            <span>
                                                                {contact.phones[0].number}
                                                                {contact.phones.length > 1 && (
                                                                    <Badge ml={2} variant='subtle' colorScheme='green'>
                                                                        +{contact.phones.length - 1}
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                            <PopoverArrow />
                                                            <PopoverBody>
                                                                {contact.phones.slice(1).map((phone, index) => (
                                                                    <div key={index}>{phone.number}</div>
                                                                ))}
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    'No phone number'
                                                )}
                                            </Td>

                                            <Td>
                                                <Stack direction='row' spacing={4}>
                                                    <IconButton variant='ghost' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                                    <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                                    <IconButton onClick={() => onOpenModal(contact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                                </Stack>
                                            </Td>

                                            <Modal isOpen={isOpen} onClose={onClose}>
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalHeader></ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        {selectedContactId !== null &&
                                                            contacts.map((contact) => {
                                                                if (contact.id === selectedContactId) {
                                                                    return (
                                                                        <div key={contact.id}>
                                                                            <Heading as='h4' size='md' mb={4}>
                                                                                Delete contact for {contact.first_name} {contact.last_name} ?
                                                                            </Heading>
                                                                            <div>
                                                                                <Button leftIcon={<GoTrash />} colorScheme='red' variant='solid'>
                                                                                    Yes, delete
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                    </ModalBody>
                                                    <ModalFooter></ModalFooter>
                                                </ModalContent>
                                            </Modal>

                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(contacts.length / pageSize)}
                                onPageChange={handlePageChange}
                            />
                        </TableContainer>
                    </CardBody>
                </Card>
            </Center>
        </div>
    )
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Stack direction='row' align='center' justify='center' mt={4}>
            {pageNumbers.map((pageNumber) => (
                <Button
                    variant={currentPage === pageNumber ? 'solid' : 'outline'}
                    size={'sm'}
                    key={pageNumber}
                    colorScheme={currentPage === pageNumber ? 'blue' : 'gray'}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </Button>
            ))}
        </Stack>
    );
};

export default ContactList;