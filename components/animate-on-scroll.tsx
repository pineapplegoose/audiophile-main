'use client'
import { motion } from 'motion/react'
import { HTMLAttributes, ReactNode } from 'react'

const variants = {
    fadeUp:    { hidden: { opacity: 0, y: 40  }, visible: { opacity: 1, y: 0  } },
    fadeDown:  { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0  } },
    fadeLeft:  { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0  } },
    fadeRight: { hidden: { opacity: 0, x: 60  }, visible: { opacity: 1, x: 0  } },
    fade:      { hidden: { opacity: 0         }, visible: { opacity: 1        } },
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: keyof typeof variants
    delay?: number
    duration?: number
    children: ReactNode
}

export const AnimateOnScroll = ({
    variant = 'fadeUp',
    delay = 0,
    duration = 0.6,
    className,
    children,
    ...rest
}: Props) => (
    <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={variants[variant]}
        transition={{ duration, delay, ease: 'easeOut' }}
        {...rest}
    >
        {children}
    </motion.div>
)
