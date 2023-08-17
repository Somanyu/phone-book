import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Avatar, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Stack, Button, Center, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Card, CardBody, Heading, HStack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, InputGroup, Input, InputRightElement, InputLeftElement } from '@chakra-ui/react'
import { GoTrash, GoSearch, GoPencil, GoHeart, GoPersonAdd } from "react-icons/go";

// Config files
import client from '../config/apolloClient';
import { GetContactList } from '../config/queries';
import { Contact } from '../config/types';

type Props = {}

const ContactList = (props: Props) => {

    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [favoriteCurrentPage, setFavoriteCurrentPage] = useState<number>(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const pageSize = 10; // Number of rows per page

    const getContacts = async () => {
        // Check if contacts data is present in local storage
        const storedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        if (storedContacts.length > 0) {
            // console.log("FROM LOCAL STORAGE")
            setContacts(storedContacts);
        } else {
            // console.log("NOT FROM LOCAL STORAGE")
            const { data } = await client.query({
                query: GetContactList,
            });
            setContacts(data.contact);
            // Store the fetched contacts in local storage
            localStorage.setItem('contacts', JSON.stringify(data.contact));
        }
    };

    const addToFavorites = (contactId: any) => {
        const updatedContacts = contacts.map(contact => {
            if (contact.id === contactId) {
                return { ...contact, isFavorite: true };
            }
            return contact;
        });
        setContacts(updatedContacts);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    };


    const removeFromFavorites = (contactId: any) => {
        const updatedContacts = contacts.map(contact => {
            if (contact.id === contactId) {
                return { ...contact, isFavorite: false };
            }
            return contact;
        });
        setContacts(updatedContacts);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    };

    const filteredContacts = contacts.filter(contact =>
        contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.phones && contact.phones.some(phone => phone.number.includes(searchQuery)))
    );



    useEffect(() => {
        getContacts();
    }, []);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Pagination for favorite contact
    const favoriteStartIndex = (favoriteCurrentPage - 1) * pageSize;
    const favoriteEndIndex = favoriteStartIndex + pageSize;

    const handleFavoritePageChange = (newFavoritePage: number) => {
        setFavoriteCurrentPage(newFavoritePage);
    }

    const onOpenModal = (contactId: number) => {
        setSelectedContactId(contactId);
        onOpen();
    };

    return (
        <div>
            <HStack mb={10} mt={'10'} justify={'center'}>
                <Heading textAlign={'center'}>Contact List</Heading>
                <Link to='/add/contact'>
                    <Button size={'sm'} ml={'3'} leftIcon={<GoPersonAdd />} colorScheme='whatsapp' variant='solid'>
                        Add Contact
                    </Button>
                </Link>
            </HStack>

            <Container>
                <InputGroup mb={4} size='md'>
                    <Input
                        pr='4.5rem'
                        type={'text'}
                        value={searchQuery}
                        placeholder='Search contacts'
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <InputLeftElement pointerEvents='none'>
                        <GoSearch color='gray.300' />
                    </InputLeftElement>
                </InputGroup>
            </Container>

            <Center>
                <Card>
                    <CardBody>
                        <Tabs isFitted variant='line'>
                            <TabList>
                                <Tab>Contact List</Tab>
                                <Tab>Favorite Contacts</Tab>
                            </TabList>
                            <TabPanels>

                                {/* Contact List */}
                                <TabPanel>
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
                                                {filteredContacts
                                                    .slice(startIndex, endIndex)
                                                    .map((contact) => {
                                                        const isFavorite = contact.isFavorite; // Check if the contact is in the favorite list
                                                        return (
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
                                                                        {isFavorite ? (
                                                                            <IconButton onClick={() => removeFromFavorites(contact.id)} variant='solid' colorScheme='pink' aria-label='Remove from favorites' icon={<GoHeart />} />
                                                                        ) : (
                                                                            <IconButton onClick={() => addToFavorites(contact.id)} variant='ghost' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                                                        )}
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
                                                        );
                                                    })}
                                            </Tbody>
                                        </Table>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredContacts.length / pageSize)}
                                            onPageChange={handlePageChange}
                                        />
                                    </TableContainer>
                                </TabPanel>

                                <TabPanel>
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
                                                {contacts
                                                    .filter(contact => contact.isFavorite)
                                                    .slice(favoriteStartIndex, favoriteEndIndex)
                                                    .map(favoriteContact => (
                                                        <Tr key={favoriteContact.id}>

                                                            <Td><Avatar name={`${favoriteContact.first_name} ${favoriteContact.last_name}`} src={`https://api.dicebear.com/6.x/lorelei/svg?seed=${favoriteContact.first_name}`} /></Td>

                                                            <Td>{favoriteContact.first_name} {favoriteContact.last_name}</Td>

                                                            <Td>
                                                                {favoriteContact.phones && favoriteContact.phones.length > 0 ? (
                                                                    <Popover trigger='hover'>
                                                                        <PopoverTrigger>
                                                                            <span>
                                                                                {favoriteContact.phones[0].number}
                                                                                {favoriteContact.phones.length > 1 && (
                                                                                    <Badge ml={2} variant='subtle' colorScheme='green'>
                                                                                        +{favoriteContact.phones.length - 1}
                                                                                    </Badge>
                                                                                )}
                                                                            </span>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent>
                                                                            <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                                            <PopoverArrow />
                                                                            <PopoverBody>
                                                                                {favoriteContact.phones.slice(1).map((phone, index) => (
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
                                                                    <IconButton onClick={() => removeFromFavorites(favoriteContact.id)} variant='solid' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                                                    <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                                                    <IconButton onClick={() => onOpenModal(favoriteContact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                                                </Stack>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                            </Tbody>
                                        </Table>
                                        <Pagination
                                            currentPage={favoriteCurrentPage}
                                            totalPages={Math.ceil(contacts.filter(contact => contact.isFavorite).length / pageSize)}
                                            onPageChange={handleFavoritePageChange}
                                        />
                                    </TableContainer>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </CardBody>
                </Card>

            </Center>

            <Center>

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