<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderMail extends Mailable
{
    use Queueable, SerializesModels;


    public $user;
    public $order;
    public $order_id;
    public $date;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($order)
    {
        $user = $order->user;
        $this->date = $order->created_at;
        $this->user = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'type' => $order->delivery?'Доставка':'Самовывоз',
            'adress' => $order->delivery?"$order->index, $order->city, $order->street, $order->building"
                .($order->apartment===null?"":", $order->apartment"):"",
            'comment' => $order->comment===null?"":$order->comment,
            'price' => $order->price,
            'price_discount' => $order->price_discount
        ];
        $this->order_id = $order->id;
        $positions = $order->positions;
        $positionsArray = $positions->toArray();
        foreach($positions as $key => $position) {
            $product = $position->product;
            $size = $position->size;
            $positionsArray[$key]['size'] = $size->name;
            $positionsArray[$key]['name'] = $product->name;
            $positionsArray[$key]['article'] = "$product->article-".$product->color->article."-$size->name";
        }
        $this->order = $positionsArray;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Новый заказ',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'mail'
        );
    
    }


    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
