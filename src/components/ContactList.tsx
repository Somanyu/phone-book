import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Avatar, Tooltip, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Stack, Button, Center, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Card, CardBody, Heading, HStack, useDisclosure, InputGroup, Input, InputLeftElement } from '@chakra-ui/react'
import { GoTrash, GoSearch, GoPencil, GoHeart, GoPersonAdd } from "react-icons/go";

// Config files
import client from '../config/apolloClient';
import { GetContactList } from '../config/queries';
import { Contact } from '../config/types';

// Components
import FavoriteContactList from './FavoriteContactList';
import ContactDeleteDialog from './ContactDeleteDialog';


const ContactList = () => {

    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [favoriteCurrentPage, setFavoriteCurrentPage] = useState<number>(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const pageSize = 10; // Number of rows per page

    const getContacts = async () => {
        const { data } = await client.query({
            query: GetContactList,
        });
        setContacts(data.contact);
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
                <Link to='/contact/add'>
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
                                                                            <span>
                                                                                +{contact.phones[0].number}
                                                                                {contact.phones.length > 1 && (
                                                                                    <PopoverTrigger>
                                                                                        <Badge ml={2} variant='subtle' colorScheme='green'>
                                                                                            +{contact.phones.length - 1}
                                                                                        </Badge>
                                                                                    </PopoverTrigger>
                                                                                )}
                                                                            </span>
                                                                            <PopoverContent>
                                                                                <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                                                <PopoverArrow />
                                                                                <PopoverBody>
                                                                                    {contact.phones.slice(1).map((phone, index) => (
                                                                                        <div key={index}>+{phone.number}</div>
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
                                                                            <Tooltip hasArrow placement='top' label='Remove from favorites'>
                                                                                <IconButton onClick={() => removeFromFavorites(contact.id)} variant='solid' colorScheme='pink' aria-label='Remove from favorites' icon={<GoHeart />} />
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <Tooltip hasArrow placement='top' label='Add to favorites'>
                                                                                <IconButton onClick={() => addToFavorites(contact.id)} variant='ghost' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip hasArrow placement='top' label='Edit contact'>
                                                                            <Link to={`/contact/edit/${contact.id}`}>
                                                                                <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                                                            </Link>
                                                                            {/* <IconButton onClick={() => onEditModalOpen(contact.id)} variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} /> */}
                                                                        </Tooltip>
                                                                        <Tooltip hasArrow placement='top' label='Delete'>
                                                                            <IconButton onClick={() => onOpenModal(contact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </Td>


                                                                <ContactDeleteDialog
                                                                    isOpen={isOpen}
                                                                    onClose={onClose}
                                                                    selectedContactId={selectedContactId}
                                                                    contacts={contacts}
                                                                />

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

                                {/* Favorite Contact List */}
                                <TabPanel>
                                    <FavoriteContactList
                                        contacts={contacts}
                                        favoriteCurrentPage={favoriteCurrentPage}
                                        pageSize={pageSize}
                                        favoriteStartIndex={favoriteStartIndex}
                                        favoriteEndIndex={favoriteEndIndex}
                                        handleFavoritePageChange={handleFavoritePageChange}
                                        removeFromFavorites={removeFromFavorites}
                                        onOpenModal={onOpenModal}
                                    />
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

export const Pagination: React.FC<PaginationProps> = ({
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