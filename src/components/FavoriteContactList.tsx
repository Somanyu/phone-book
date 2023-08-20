import React from 'react'
import { Avatar, Badge, Stack, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Tooltip } from '@chakra-ui/react'
import { GoHeart, GoPencil, GoTrash } from 'react-icons/go';
import { Pagination } from './ContactList';

// Config files
import { Contact } from '../config/types';
import { Link } from 'react-router-dom';

interface FavoriteContactListProps {
    contacts: Contact[];
    favoriteCurrentPage: number;
    pageSize: number;
    favoriteStartIndex: number;
    favoriteEndIndex: number;
    handleFavoritePageChange: (page: number) => void;
    removeFromFavorites: (id: any) => void;
    onOpenModal: (id: any) => void;
}


const FavoriteContactList: React.FC<FavoriteContactListProps> = ({
    contacts,
    favoriteCurrentPage,
    pageSize,
    favoriteStartIndex,
    favoriteEndIndex,
    handleFavoritePageChange,
    removeFromFavorites,
    onOpenModal,
}) => {
    return (
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
                                            <span>
                                                +{favoriteContact.phones[0].number}
                                                {favoriteContact.phones.length > 1 && (
                                                    <PopoverTrigger>
                                                        <Badge ml={2} variant='subtle' colorScheme='green'>
                                                            +{favoriteContact.phones.length - 1}
                                                        </Badge>
                                                    </PopoverTrigger>
                                                )}
                                            </span>
                                            <PopoverContent>
                                                <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                <PopoverArrow />
                                                <PopoverBody>
                                                    {favoriteContact.phones.slice(1).map((phone, index) => (
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
                                        <Tooltip hasArrow placement='top' label='Remove from favorites'>
                                            <IconButton onClick={() => removeFromFavorites(favoriteContact.id)} variant='solid' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                        </Tooltip>
                                        <Tooltip hasArrow placement='top' label='Edit contact'>
                                            <Link to={`/contact/edit/${favoriteContact.id}`}>
                                                <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                            </Link>
                                            {/* <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} /> */}
                                        </Tooltip>
                                        <Tooltip hasArrow placement='top' label='Delete'>
                                            <IconButton onClick={() => onOpenModal(favoriteContact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                        </Tooltip>
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
    )
}

export default FavoriteContactList