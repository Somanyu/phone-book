import { useState, useEffect } from 'react';
import { Input, FormControl, FormLabel, Center, Card, CardBody, Grid, Heading, GridItem, Flex, Button, Spacer } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';

// Config files
import { GetContactDetail } from '../config/queries';
import { Contact } from '../config/types';
import { GoArrowLeft, GoCheck } from 'react-icons/go';

type Props = {}

const EditContact = (props: Props) => {
    const { id } = useParams<{ id: string }>();

    const [contact, setContact] = useState<Contact | null>(null);

    const { loading, error, data } = useQuery(GetContactDetail, {
        variables: { id },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setContact(data.contact_by_pk);
        }
    }, [loading, error, data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Heading mb={10} mt={10} textAlign={'center'}>Edit {contact?.first_name || ""} Contact</Heading>
            <Center>
                <Card>
                    <CardBody>

                        <Grid templateColumns='repeat(2, 1fr)' gap={4} mb={3}>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel>First name</FormLabel>
                                    <Input placeholder='First name' value={contact?.first_name || "No first name"} />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel>Last name</FormLabel>
                                    <Input placeholder='Last name' value={contact?.last_name || "No last name"} />
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <Grid templateColumns='repeat(5, 2fr)' gap={4}>
                            <GridItem colSpan={3}>
                                <FormControl isRequired>
                                    <FormLabel>Phone number</FormLabel>
                                    {contact?.phones.map((phone, index) => (
                                        <div key={index}>
                                            <PhoneInput
                                                value={phone.number}
                                                containerStyle={{ marginTop: '3.5px' }}
                                                inputStyle={{
                                                    height: '2.5rem',
                                                    fontSize: '1rem',
                                                    borderRadius: '0.375rem',
                                                    borderColor: 'inherit',
                                                    background: 'inherit'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </FormControl>
                            </GridItem>
                        </Grid>
                        <Flex mt={10}>
                            <Link to='/'>
                                <Button leftIcon={<GoArrowLeft />} colorScheme='red' variant='ghost'>
                                    Contact list
                                </Button>
                            </Link>
                            <Spacer />
                            <Button leftIcon={<GoCheck />} type='submit' colorScheme='whatsapp' >
                                Save
                            </Button>
                        </Flex>


                    </CardBody>
                </Card>
            </Center>
        </div>
    );
}

export default EditContact;